import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

# ==========================================
# API ROUTERS
# ==========================================
from app.api.routes.auth import router as auth_router
from app.api.routes.chatbot import router as chatbot_router
from app.api.routes.certificates import router as certificates_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.language import router as language_router
from app.api.routes.lessons import router as lessons_router
from app.api.routes.modules import router as modules_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.phishing import router as phishing_router
from app.api.routes.quiz_analytics import router as quiz_analytics_router
from app.api.routes.quiz_attempts import router as quiz_attempt_router
from app.api.routes.quizzes import router as quizzes_router
from app.api.routes.users import router as users_router, admin_router as admin_users_router
from app.api.translation.router import router as translation_router

# ==========================================
# CORE / DATABASE / MIDDLEWARE / SERVICES
# ==========================================
from app.core.config import settings
from app.database.mongodb.connection import (
    close_mongo_connection,
    connect_to_mongo,
)
from app.middleware.exception_handler import register_exception_handlers
from app.middleware.language import LanguageMiddleware
from app.middleware.logging import LoggingMiddleware
from app.services.background_scheduler import phishing_scheduler_loop


# ==========================================
# APPLICATION LIFESPAN
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CyberAware Backend...")

    # ------------------------------------------
    # Connect to MongoDB
    # ------------------------------------------
    await connect_to_mongo()
    print("✅ MongoDB Connected Successfully")

    # ------------------------------------------
    # Start Phishing Scheduler
    # ------------------------------------------
    scheduler_task = None

    if settings.PHISHING_SCHEDULER_ENABLED:
        print("🛡️ Starting phishing scheduler...")

        scheduler_task = asyncio.create_task(
            phishing_scheduler_loop()
        )

        print("✅ Phishing scheduler started")
    else:
        print("⏸️ Phishing scheduler disabled")

    try:
        # --------------------------------------
        # Application is running
        # --------------------------------------
        yield

    finally:
        # --------------------------------------
        # Shutdown
        # --------------------------------------
        print("🛑 Shutting Down CyberAware Backend...")

        # --------------------------------------
        # Stop Phishing Scheduler
        # --------------------------------------
        if scheduler_task is not None:
            print("🛑 Stopping phishing scheduler...")

            scheduler_task.cancel()

            try:
                await scheduler_task
            except asyncio.CancelledError:
                print("✅ Phishing scheduler stopped")

        # --------------------------------------
        # Close MongoDB
        # --------------------------------------
        await close_mongo_connection()
        print("✅ MongoDB Connection Closed")


# ==========================================
# FASTAPI APPLICATION
# ==========================================
app = FastAPI(
    title="CyberAware API",
    description="AI Powered Enterprise Cybersecurity Awareness Platform",
    version="1.0.0",
    lifespan=lifespan,
)


# ==========================================
# SWAGGER JWT AUTHORIZATION
# Adds the 🔒 Authorize button.
# ==========================================
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Use the exact name FastAPI's HTTPBearer dependency expects.
    openapi_schema["components"]["securitySchemes"] = {
        "HTTPBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Apply bearer auth globally.
    openapi_schema["security"] = [{"HTTPBearer": []}]

    app.openapi_schema = openapi_schema

    return app.openapi_schema


app.openapi = custom_openapi


# ==========================================
# MIDDLEWARE
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(LanguageMiddleware)

register_exception_handlers(app)


# ==========================================
# HEALTH ENDPOINTS
# ==========================================
@app.get("/", tags=["Health"])
async def root():
    return {
        "success": True,
        "application": "CyberAware Backend",
        "version": "1.0.0",
        "status": "Running",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "success": True,
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT,
    }


# ==========================================
# API VERSION PREFIX
# ==========================================
API_PREFIX = "/api/v1"


# ==========================================
# AUTHENTICATION ROUTES
#
# Final URLs:
# /api/v1/auth/register
# /api/v1/auth/login
# /api/v1/auth/me
# ==========================================
app.include_router(
    auth_router,
    prefix=API_PREFIX,
)


# ==========================================
# USER ROUTES
# ==========================================
app.include_router(
    users_router,
    prefix=API_PREFIX,
)

app.include_router(
    admin_users_router,
    prefix=API_PREFIX,
)


# ==========================================
# DASHBOARD ROUTES
# ==========================================
app.include_router(
    dashboard_router,
    prefix=API_PREFIX,
)


# ==========================================
# NOTIFICATION ROUTES
# ==========================================
app.include_router(
    notifications_router,
    prefix=API_PREFIX,
)


# ==========================================
# MODULE ROUTES
# ==========================================
app.include_router(
    modules_router,
    prefix=API_PREFIX,
)


# ==========================================
# LESSON ROUTES
# ==========================================
app.include_router(
    lessons_router,
    prefix=API_PREFIX,
)


# ==========================================
# QUIZ ROUTES
# ==========================================
app.include_router(
    quizzes_router,
    prefix=API_PREFIX,
)


# ==========================================
# QUIZ ATTEMPT ROUTES
# ==========================================
app.include_router(
    quiz_attempt_router,
    prefix=API_PREFIX,
)


# ==========================================
# QUIZ ANALYTICS ROUTES
# ==========================================
app.include_router(
    quiz_analytics_router,
    prefix=API_PREFIX,
)


# ==========================================
# CHATBOT ROUTES
# ==========================================
app.include_router(
    chatbot_router,
    prefix=API_PREFIX,
)

# ==========================================
# CERTIFICATE ROUTES
# ==========================================
app.include_router(
    certificates_router,
    prefix=API_PREFIX,
)


# ==========================================
# PHISHING ROUTES
# ==========================================
app.include_router(
    phishing_router,
    prefix=API_PREFIX,
)


# ==========================================
# LANGUAGE ROUTES
# ==========================================
app.include_router(
    language_router,
    prefix=API_PREFIX,
)

# ==========================================
# TRANSLATION ROUTES
# ==========================================
app.include_router(
    translation_router,
    prefix=API_PREFIX,
)
