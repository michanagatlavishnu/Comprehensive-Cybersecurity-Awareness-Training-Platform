# CyberAware

Cybersecurity awareness training platform.

## Project layout

- `frontend/`: React + Vite application
- `backend/`: FastAPI application
- `database/`: MongoDB scripts and seed data
- `docs/`: project documentation
- `assets/`: shared logos, icons, and static images
- `uploads/`: generated certificates and reports

## Local development

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Copy `.env.example` to `.env` and fill in service credentials before connecting external services. For local OTP testing without SMTP, set `EXPOSE_DEVELOPMENT_OTP=true` in the backend environment; do not enable it outside development.
"# CyberAware" 
"# CyberAware" 
