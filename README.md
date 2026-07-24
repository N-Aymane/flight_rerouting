# RAM iRROPS Dashboard

A modern Next.js dashboard concept for airline irregular operations (iROPS) planning. The app focuses on flight-delay prediction, disruption risk monitoring, and financial impact optimization for a Morocco-based operations hub.

## What It Does

- Shows a live-style operations dashboard with disruption KPIs.
- Lists flights with risk status, passenger impact, and departure times.
- Displays a detailed panel for the selected flight, including financial exposure and optimization savings.
- Uses mock data so the interface can be explored without any backend setup.
- Includes a FastAPI backend that loads the XGBoost joblib model when the artifact is compatible with the local Python runtime.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react icons
- shadcn/ui-style component primitives

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- Python 3.12 or newer for the backend API

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Start the model backend in a second terminal:

```bash
cd backend
"..\\.venv\\Scripts\\python.exe" -m pip install -r requirements.txt
"..\\.venv\\Scripts\\python.exe" -m uvicorn main:app --reload --port 8000
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Available Scripts

- `pnpm dev` - run the development server
- `pnpm build` - create a production build
- `pnpm start` - start the production server
- `pnpm lint` - run ESLint across the project
- `cd backend && uvicorn main:app --reload --port 8000` - run the model API locally

## Project Structure

- `app/` - Next.js app router files, global styles, and the main page
- `components/` - dashboard UI components such as the flight list and metrics cards
- `components/ui/` - reusable UI primitives
- `lib/` - utility helpers and theme context
- `public/` - static assets

## How The Dashboard Is Organized

The main page in `app/page.tsx` now requests predictions from the backend and uses them to enrich the flight list. If the joblib artifact cannot be deserialized in the current Python environment, the backend falls back to a deterministic score so the dashboard still renders while you refine the model contract later.

The backend entry point is `backend/main.py`. It loads `xgb_model_ohefixed.joblib`, exposes `/health`, `/predict`, and `/predict/batch`, and accepts an optional `features` map so you can add the exact model inputs later without changing the route shape.

Important: the current `xgb_model_ohefixed.joblib` artifact is compatible with `xgboost==2.1.4` in this workspace. Newer major/minor versions may fail to deserialize this serialized model object.

## Customization Notes

- Update the mock flight data in `app/page.tsx` to change the dashboard content.
- Edit `components/FlightList.tsx` and `components/FlightDetailsPanel.tsx` to adjust the layout and business logic.
- Update theme or global styling in `app/globals.css` and `lib/theme-context.tsx`.

## Deployment

This project is ready to deploy as a standard Next.js application. Build it with `pnpm build`, then run it with `pnpm start` in your production environment.
