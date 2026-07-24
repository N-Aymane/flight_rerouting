from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any, Literal

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


LOGGER = logging.getLogger('ram-irrops-backend')
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / 'xgb_model_ohefixed.joblib'


class FlightPredictionInput(BaseModel):
    flight_id: str
    carrier: str | None = None
    route: str | None = None
    departure_time: str | None = None
    hub: str | None = None
    origin: str | None = None
    destination: str | None = None
    affected_passengers: int = 0
    delay_minutes: float | None = None
    weather_risk: float | None = None
    features: dict[str, Any] = Field(default_factory=dict)


class BatchPredictionInput(BaseModel):
    flights: list[FlightPredictionInput]


class FlightPredictionOutput(BaseModel):
    flight_id: str
    delay_probability: float
    predicted_class: int
    status: Literal['critical', 'warning', 'safe']
    model_ready: bool
    used_fallback: bool
    source: str
    notes: list[str] = Field(default_factory=list)


class BatchPredictionOutput(BaseModel):
    model_ready: bool
    used_fallback: bool
    source: str
    flights: list[FlightPredictionOutput]


class ModelService:
    def __init__(self, model_path: Path) -> None:
        self.model_path = model_path
        self.model: Any | None = None
        self.load_error: str | None = None
        self.feature_names: list[str] = []
        self._load()

    def _load(self) -> None:
        if not self.model_path.exists():
            self.load_error = f'Model file not found: {self.model_path}'
            return

        try:
            self.model = joblib.load(self.model_path)
            self.feature_names = self._resolve_feature_names(self.model)
        except Exception as exc:  # pragma: no cover - startup robustness
            self.model = None
            self.load_error = str(exc)
            LOGGER.warning('Model load failed: %s', exc)

    @staticmethod
    def _resolve_feature_names(model: Any) -> list[str]:
        if hasattr(model, 'feature_names_in_'):
            return [str(name) for name in model.feature_names_in_]

        if hasattr(model, 'get_booster'):
            try:
                booster = model.get_booster()
                if booster.feature_names:
                    return [str(name) for name in booster.feature_names]
            except Exception:
                return []

        return []

    @staticmethod
    def _heuristic_probability(payload: FlightPredictionInput) -> float:
        score = 0.12

        if payload.weather_risk is not None:
            score += min(max(payload.weather_risk, 0.0), 1.0) * 0.5

        if payload.delay_minutes is not None:
            score += min(max(payload.delay_minutes / 120.0, 0.0), 1.0) * 0.22

        score += min(max(payload.affected_passengers / 400.0, 0.0), 1.0) * 0.12

        route_hint = f"{payload.route or ''} {payload.hub or ''}".lower()
        if any(keyword in route_hint for keyword in ('jfk', 'lhr', 'cdg', 'ams', 'fra')):
            score += 0.08

        return round(min(score, 0.99), 4)

    @staticmethod
    def _status_from_probability(probability: float) -> str:
        if probability >= 0.7:
            return 'critical'
        if probability >= 0.4:
            return 'warning'
        return 'safe'

    def _build_frame(self, payload: FlightPredictionInput) -> pd.DataFrame:
        feature_data = dict(payload.features)

        if payload.carrier is not None:
            feature_data.setdefault('carrier', payload.carrier)
        if payload.route is not None:
            feature_data.setdefault('route', payload.route)
        if payload.departure_time is not None:
            feature_data.setdefault('departure_time', payload.departure_time)
        if payload.hub is not None:
            feature_data.setdefault('hub', payload.hub)
        if payload.origin is not None:
            feature_data.setdefault('origin', payload.origin)
        if payload.destination is not None:
            feature_data.setdefault('destination', payload.destination)
        feature_data.setdefault('affected_passengers', payload.affected_passengers)
        if payload.delay_minutes is not None:
            feature_data.setdefault('delay_minutes', payload.delay_minutes)
        if payload.weather_risk is not None:
            feature_data.setdefault('weather_risk', payload.weather_risk)

        frame = pd.DataFrame([feature_data])

        if self.feature_names:
            for column in self.feature_names:
                if column not in frame.columns:
                    frame[column] = 0
            frame = frame[self.feature_names]

        return frame

    def predict(self, payload: FlightPredictionInput) -> FlightPredictionOutput:
        notes: list[str] = []
        used_fallback = self.model is None
        probability = self._heuristic_probability(payload)

        if self.model is not None:
            try:
                frame = self._build_frame(payload)
                if hasattr(self.model, 'predict_proba'):
                    probability = float(self.model.predict_proba(frame)[0][1])
                else:
                    prediction = self.model.predict(frame)
                    probability = float(prediction[0])
                used_fallback = False
            except Exception as exc:  # pragma: no cover - runtime safeguard
                used_fallback = True
                notes.append(f'Fallback used because model inference failed: {exc}')
                probability = self._heuristic_probability(payload)

        probability = round(min(max(probability, 0.0), 0.99), 4)
        predicted_class = int(probability >= 0.5)
        status = self._status_from_probability(probability)

        if self.model is None and self.load_error:
            notes.append(f'Model load failed at startup: {self.load_error}')

        return FlightPredictionOutput(
            flight_id=payload.flight_id,
            delay_probability=probability,
            predicted_class=predicted_class,
            status=status,
            model_ready=self.model is not None,
            used_fallback=used_fallback,
            source='xgb_model_ohefixed.joblib' if self.model is not None else 'heuristic-fallback',
            notes=notes,
        )


service = ModelService(MODEL_PATH)

app = FastAPI(title='RAM iRROPS Model API', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',') if origin.strip()],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
def health() -> dict[str, Any]:
    return {
        'status': 'ok',
        'model_ready': service.model is not None,
        'model_path': str(MODEL_PATH),
        'source': 'xgb_model_ohefixed.joblib' if service.model is not None else 'heuristic-fallback',
        'load_error': service.load_error,
    }


@app.post('/predict', response_model=FlightPredictionOutput)
def predict_one(payload: FlightPredictionInput) -> FlightPredictionOutput:
    return service.predict(payload)


@app.post('/predict/batch', response_model=BatchPredictionOutput)
def predict_batch(payload: BatchPredictionInput) -> BatchPredictionOutput:
    predictions = [service.predict(flight) for flight in payload.flights]
    return BatchPredictionOutput(
        model_ready=service.model is not None,
        used_fallback=service.model is None,
        source='xgb_model_ohefixed.joblib' if service.model is not None else 'heuristic-fallback',
        flights=predictions,
    )