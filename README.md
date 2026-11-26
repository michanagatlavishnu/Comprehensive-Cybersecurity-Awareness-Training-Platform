# CyberAware

CyberAware is a cybersecurity awareness and training platform for organizations. It combines employee learning with administrative tools to help teams build safer security habits.

## Features

- Security awareness courses, lessons, quizzes, and certificates
- Phishing simulations and campaign reporting
- AI-assisted security guidance and learning tools
- Employee progress dashboards and administrative analytics
- English, Hindi, and Telugu interface translations

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Beanie, MongoDB

## Prerequisites

- Node.js and npm
- Python 3.14
- MongoDB, or Docker with Docker Compose

## Run locally

### 1. Start MongoDB

From the project root, start the included MongoDB service with Docker Compose:

```powershell
docker compose up -d mongodb
```

Alternatively, run a local MongoDB server on `localhost:27017`.

### 2. Configure and run the backend

The backend reads its environment from `backend/.env`. Create it from the example file:

```powershell
Copy-Item .env.example backend\.env
```

The example uses local development settings. Set `EXPOSE_DEVELOPMENT_OTP=true` in `backend/.env` if you are testing registration without an SMTP service; the OTP will be returned to the frontend. Keep this disabled outside local development.

Install dependencies and start the API:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`.

### 3. Run the frontend

Open another terminal from the project root:

```powershell
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. In development, Vite proxies `/api` requests to the backend.

## Environment configuration

`backend/.env` must provide a `SECRET_KEY`, `MONGODB_URI`, `GROQ_API_KEY`, and mail settings (`MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_PORT`, and `MAIL_SERVER`). The example file provides local placeholders for development. Configure real credentials for the services you use, and never commit `.env` files or production secrets.

For frontend builds outside the Vite development server, set `VITE_API_URL` in `frontend/.env.production` to the deployed API base URL (including `/api/v1`).

## Project layout

- `frontend/` — React web application
- `backend/` — FastAPI application and API
- `database/` — MongoDB collection notes and seed scripts
- `docs/` — project documentation
- `deployment/` — deployment notes
- `assets/` — shared project assets
