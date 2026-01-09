# FemWell AI — PCOS Screening Web App

FemWell AI is a full‑stack web app that provides **PCOS screening insights** based on a short health assessment.

> **Medical disclaimer:** This app provides screening insights only and is **not** a medical diagnosis.

## What’s included

- **Password authentication** (email + password) with DB‑backed sessions (httpOnly cookie)
- **Assessment wizard** that saves results to Postgres
- **PCOS probability output** (0..1) + likelihood label (unlikely/possible/likely)
- **Results & Profile pages** showing latest saved assessment
- **Report Scanner UI** (upload UX; model integration can be added later)

## Tech stack

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** Node.js + Express + TypeScript
- **DB:** Postgres (Drizzle ORM) — typically hosted on Supabase
- **ML:** Python + scikit‑learn model, executed by the Node server (via child process)

## Monorepo layout

- `client/` — React app (Vite)
- `server/` — Express API
- `shared/` — shared Zod schemas/types
- `dataset/` — training + inference scripts and model artifacts

## API endpoints (core)

| Route | Method | Description |
|---|---:|---|
| `/api/health` | GET | Health check (always 200) |
| `/api/auth/register` | POST | Register (email + password) |
| `/api/auth/login` | POST | Login and create session |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/user` | GET | Current authenticated user |
| `/api/assessments` | POST | Save an assessment + compute screening |
| `/api/assessments/latest` | GET | Fetch latest saved assessment |
| `/api/assessments/:id` | GET | Fetch assessment by id |
| `/api/profile` | GET/PUT/DELETE | Profile CRUD |

## Environment variables

Create a `.env` file in the repo root.

Required:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
```

Recommended (for hosted Postgres / Supabase):

```bash
DATABASE_SSL=true
```

Optional (ML runtime paths):

```bash
PCOS_PYTHON=python3
PCOS_PREDICT_SCRIPT=dataset/predict.py
PCOS_MODEL_PATH=dataset/pcos_model.joblib
```

## Run locally

```bash
npm install
npm run db:push
npm run dev
```

Open:

- App: http://localhost:5000
- Health check: http://localhost:5000/api/health

## Model notes

The screening model is a scikit‑learn pipeline. The server runs inference via `dataset/predict.py` and returns:

- `pcosProbability` (0..1)
- `pcosLikelihood` (`unlikely` / `possible` / `likely`)
- `modelVersion`

If Python inference fails, the server falls back to a lightweight rule‑based screening output.

## Deployment

### Backend (Render)

This repo includes a Docker-based deployment.

- Render Web Service uses `Dockerfile`
- Set `DATABASE_URL` (and optionally `DATABASE_SSL=true`) in Render environment variables
- Verify: `https://<render-service>.onrender.com/api/health`

### Frontend (Netlify)

Netlify hosts the static frontend and proxies `/api/*` to Render.

- `netlify.toml` proxies `/api/*` → Render
- SPA routing is enabled via a fallback redirect to `/index.html`

## Security notes

- Do **not** commit real `DATABASE_URL` secrets to Git.
- If a secret ever leaks, rotate it in your DB provider and update Render env vars.
