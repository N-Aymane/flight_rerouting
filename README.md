# RAM iRROPS Dashboard

A modern Next.js dashboard concept for airline irregular operations (iROPS) planning. The app focuses on flight-delay prediction, disruption risk monitoring, and financial impact optimization for a Morocco-based operations hub.

## What It Does

- Shows a live-style operations dashboard with disruption KPIs.
- Lists flights with risk status, passenger impact, and departure times.
- Displays a detailed panel for the selected flight, including financial exposure and optimization savings.
- Uses mock data so the interface can be explored without any backend setup.

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

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Available Scripts

- `pnpm dev` - run the development server
- `pnpm build` - create a production build
- `pnpm start` - start the production server
- `pnpm lint` - run ESLint across the project

## Project Structure

- `app/` - Next.js app router files, global styles, and the main page
- `components/` - dashboard UI components such as the flight list and metrics cards
- `components/ui/` - reusable UI primitives
- `lib/` - utility helpers and theme context
- `public/` - static assets

## How The Dashboard Is Organized

The main page in `app/page.tsx` wires together the dashboard shell, summary metrics, the flight prediction list, and the selected-flight details panel. Flight data and passenger data are mocked in the page for now, which makes the UI easy to preview and extend later with API data.

## Customization Notes

- Update the mock flight data in `app/page.tsx` to change the dashboard content.
- Edit `components/FlightList.tsx` and `components/FlightDetailsPanel.tsx` to adjust the layout and business logic.
- Update theme or global styling in `app/globals.css` and `lib/theme-context.tsx`.

## Deployment

This project is ready to deploy as a standard Next.js application. Build it with `pnpm build`, then run it with `pnpm start` in your production environment.
