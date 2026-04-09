# NASA Explorer

NASA Explorer is a full-stack space data dashboard built on NASA's public APIs. It combines a React frontend interface with an NodeJS / Express backend that aggregates, validates, and normalizes data for astronomy media, near-Earth object tracking, Earth imagery, and planetary telemetry.

## Overview

The application is organized around three primary user views:

- `NASA MEDIA`: Search NASA's media library and inspect asset metadata.
- `LIVE`: Surface Mars weather telemetry, lunar proxy telemetry, and live mission panels.
- `NEO`: Monitor near-Earth objects with risk, velocity, distance, and diameter visualizations.

The backend acts as a service layer between the frontend and NASA APIs. It centralizes request validation, rate limiting, security middleware, error handling, and data transformation so the frontend can render consistent datasets.

## Core Features

### NASA media search

- Search the NASA Images API with pagination.
- Load asset files and metadata for selected items.
- Use a client-side cache to reduce repeated requests.

### Live telemetry panels

- Display Mars weather data sourced from NASA's InSight weather feed.
- Generate moon telemetry proxies from NASA EPIC natural imagery data.
- Present mission-style gauges, radar panels, warning overlays, and status components.

### Near-Earth object analysis

- Retrieve daily NEO feeds and date-range datasets.
- Visualize risk index, diameter distribution, velocity, miss distance, and daily volume.
- Normalize asteroid data into charts and summaries.

### Production-oriented API layer

- Security headers via `helmet`.
- Configurable CORS allowlist.
- Request throttling with `express-rate-limit`.
- Query validation using `express-validator`.
- Structured application errors and centralized error handling.

## Architecture

```text
React 19 + Vite frontend
	|
	|  /api requests
	v
Express backend
	|
	|  Axios service layer
	v
NASA public APIs
  - APOD
  - EPIC
  - NEO Feed
  - Mars Rover Manifest
  - InSight Weather
  - NASA Images API
```

### Frontend

- `React 19.2.4`
- `Vite 8`
- `React Router 7`
- `Recharts 3`
- `Tailwind CSS 4`
- CSS Modules for components' styling

### Backend

- `Node.js`
- `Express 4`
- `Axios`
- `Helmet`
- `CORS`
- `express-rate-limit`
- `express-validator`

### Local development flow

- The frontend runs on `http://localhost:5173` by default.
- The backend runs on `http://localhost:3001` by default.
- Vite proxies `/api` requests to the backend during local development.
- In deployed environments, the frontend can use `VITE_API_BASE_URL` to target a remote API.

## Project Structure

```text
nasa_explorer/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── ui/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Requirements

Before running the project locally, ensure you have:

- `Node.js 18` or later
- `npm 9` or later
- A NASA API key from `https://api.nasa.gov/`

## Quick Start

This repository is split into separate frontend and backend applications. Install dependencies in each directory.

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend/`:

```bash
NASA_API_KEY=your_nasa_api_key
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

Optional: create a `.env` file inside `frontend/` when the frontend should target a remote backend instead of relying on the Vite dev proxy.

```bash
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Available Scripts

### Backend

- `npm run dev`: Start the API server with `nodemon`.
- `npm start`: Start the API server with Node.

### Frontend

- `npm run dev`: Start the Vite development server.
- `npm run build`: Create a production build in `frontend/dist`.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint.

## Environment Variables

### Backend

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NASA_API_KEY` | Yes | None | NASA API key used for APOD, EPIC, NEO, Mars, and weather requests. |
| `PORT` | No | `3001` | Port used by the Express server. |
| `NODE_ENV` | No | `development` | Runtime mode used by the backend. |
| `ALLOWED_ORIGINS` | No | Empty in development | Comma-separated list of allowed origins for CORS. |

### Frontend

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | Empty | Base URL for API requests in non-proxy environments. |

## API Endpoints

All backend endpoints are read-only `GET` routes.

| Endpoint | Purpose | Common Query Parameters |
| --- | --- | --- |
| `/health` | Health check and API key status | None |
| `/api/apod` | Astronomy Picture of the Day | `date` |
| `/api/epic/natural` | EPIC natural color Earth imagery | `date` |
| `/api/neo/feed` | NEO feed for a single date | `date` |
| `/api/neo/range` | NEO feed for a date range | `start_date`, `end_date` |
| `/api/mars/manifest` | Mars rover mission manifest | `rover` |
| `/api/images/search` | NASA media search | `q`, `page`, `page_size` |
| `/api/images/asset` | Asset file list for a NASA media item | `nasa_id` |
| `/api/images/metadata` | Metadata for a NASA media item | `nasa_id` |
| `/api/weather/mars` | Mars weather telemetry | `date` |
| `/api/weather/moon` | Lunar proxy telemetry derived from EPIC data | `date`, `days` |

### Example requests

```bash
curl "http://localhost:3001/api/apod?date=2026-04-09"
curl "http://localhost:3001/api/images/search?q=moon&page=1&page_size=12"
curl "http://localhost:3001/api/neo/range?start_date=2026-04-01&end_date=2026-04-07"
```

## Implementation Notes

- The backend validates incoming query parameters before calling NASA APIs.
- Upstream request failures are converted into consistent application errors.
- The frontend uses dedicated hooks for each data source and applies client-side caching to reduce duplicate fetches.
- Visual components are organized around dashboard panels rather than page-per-feature navigation.

## Deployment Notes

For production deployments:

- Set `ALLOWED_ORIGINS` explicitly.
- Provide a valid `NASA_API_KEY` in the backend environment.
- Build the frontend with `npm run build` inside `frontend/`.
- Serve the frontend separately or configure it to target the deployed API with `VITE_API_BASE_URL`.

## Troubleshooting

### NASA data requests fail

- Confirm `NASA_API_KEY` is present in `backend/.env`.
- Verify the backend is running on the expected port.
- Check whether NASA upstream services are rate-limiting or unavailable.

### CORS errors in production

- Ensure the frontend origin is included in `ALLOWED_ORIGINS`.
- Separate multiple origins with commas and avoid trailing spaces where possible.

### Frontend cannot reach the API

- In local development, verify the backend is running on `http://localhost:3001`.
- In remote environments, set `VITE_API_BASE_URL` to the deployed backend URL.

## Deployment

This project is designed to be deployed as two separate services: the Express backend on Render and the React frontend on Vercel.

### Deploy the backend to Render

1. Create a new Web Service on [Render](https://render.com/).
2. Connect your repository and select the `prod` branch .
3. Configure the service:
   - **Name**: `nasa-explorer-api` 
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Health Check Path**: `/health`
   - **Environment Variables**:
     - `NASA_API_KEY`: Your NASA API key from `https://api.nasa.gov/`
     - `NODE_ENV`: `production`
     - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://yourapp.vercel.app`)
4. Deploy and note the service URL (e.g., `https://nasa-explorer-api.onrender.com`).

### Deploy the frontend to Vercel

1. Create a new project on [Vercel](https://vercel.com/).
2. Connect your repository and select the `dev` branch.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**:
     - `VITE_API_BASE_URL`: Your deployed Render backend URL (e.g., `https://nasa-explorer-api.onrender.com`)
4. Deploy and visit the provided URL.

### Verify the deployment

1. Test the backend health check:
   ```bash
   curl https://nasa-explorer-api.onrender.com/health
   ```

2. Test an API endpoint:
   ```bash
   curl "https://nasa-explorer-api.onrender.com/api/apod"
   ```

3. Visit the frontend URL and confirm that:
   - The dashboard loads without errors
   - Data panels populate (NASA MEDIA, LIVE, NEO views)
   - Hard-refreshing `https://yourapp.vercel.app/neo`, `/live`, or `/nasa-media` does not return a 404
   - The browser console shows no CORS errors when calling the API

### Platform-specific notes

**Render backend**:
- Render automatically sets the `PORT` environment variable, which the Express app respects.
- The service will spin down after 15 minutes of inactivity on the free tier. The first request may be slow. Upgrade to a paid plan for always-on services.
- Use the health check path `/health` to monitor liveness.

**Vercel frontend**:
- The `vercel.json` rewrite rule ensures that all routes are served by `index.html`, allowing React Router to handle navigation.
- Environment variables prefixed with `VITE_` are baked into the client during build time. Do not expose secrets in the frontend environment.
- Use Vercel's preview deployments for staging changes before merging to production.

## License

This project is licensed under the terms of the `LICENSE` file in the repository root.
