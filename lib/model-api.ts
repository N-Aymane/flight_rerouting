export interface FlightApiInput {
  flight_id: string
  carrier?: string
  route?: string
  departure_time?: string
  hub?: string
  origin?: string
  destination?: string
  affected_passengers?: number
  delay_minutes?: number
  weather_risk?: number
  features?: Record<string, string | number | boolean | null>
}

export interface FlightApiOutput {
  flight_id: string
  delay_probability: number
  predicted_class: number
  status: 'critical' | 'warning' | 'safe'
  model_ready: boolean
  used_fallback: boolean
  source: string
  notes: string[]
}

export interface BatchPredictionResponse {
  model_ready: boolean
  used_fallback: boolean
  source: string
  flights: FlightApiOutput[]
}

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'

export async function fetchPredictedFlights(flights: FlightApiInput[]): Promise<BatchPredictionResponse> {
  const response = await fetch(new URL('/predict/batch', backendBaseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flights }),
  })

  if (!response.ok) {
    throw new Error(`Backend prediction request failed with ${response.status}`)
  }

  return (await response.json()) as BatchPredictionResponse
}