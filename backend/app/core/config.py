from pathlib import Path
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ==========================================
    # APP
    # ==========================================
    APP_NAME: str = "CyberAware API"
    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    EXPOSE_DEVELOPMENT_OTP: bool = False

    API_PREFIX: str = "/api/v1"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ==========================================
    # JWT
    # ==========================================
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ==========================================
    # MongoDB
    # ==========================================
    MONGODB_URI: str
    DATABASE_NAME: str = "cyberaware"

    # ==========================================
    # GROQ AI
    # ==========================================
    GROQ_API_KEY: str

    YOUTUBE_API_KEY: str = ""

    GROQ_MODEL: str = "openai/gpt-oss-120b"

    GROQ_TRANSLATION_MODEL: str = "openai/gpt-oss-120b"

    AI_RESPONSE_TEMPERATURE: float = 0.3
    AI_MAX_HISTORY: int = 10

    QUIZ_GENERATION_LIMIT: int = 25

    QUIZ_DEFAULT_TIME_MINUTES: int = 10
    QUIZ_DEFAULT_PASSING_SCORE: int = 70
    QUIZ_DEFAULT_XP: int = 50
    QUIZ_DEFAULT_QUESTIONS: int = 10

    # ==========================================
    # MAIL
    # ==========================================
    MAIL_USERNAME: str
    MAIL_PASSWORD: str

    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str

    MAIL_FROM_NAME: str = "CyberAware Security"

    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    OTP_EXPIRE_MINUTES: int = 5

    # ==========================================
    # CLOUDINARY
    # ==========================================
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    SUPPORTED_LANGUAGES: List[str] = [
        "en",
        "te",
        "hi",
    ]

    DEFAULT_LANGUAGE: str = "en"

    TRANSLATION_CACHE_ENABLED: bool = True
    
    # ==========================================================
# PHISHING SIMULATION
# ==========================================================

    PHISHING_BASE_URL: str = "http://localhost:8000"

    PHISHING_FROM_NAME: str = "CyberAware Security Team"

    PHISHING_TRACKING_ENABLED: bool = True

    PHISHING_DEFAULT_LANGUAGE: str = "en"

    PHISHING_XP_CLICK_PENALTY: int = 30

    PHISHING_XP_CREDENTIAL_PENALTY: int = 50

    PHISHING_XP_REPORT_REWARD: int = 50
    
    PHISHING_SCHEDULER_ENABLED: bool = True

    PHISHING_SCHEDULER_INTERVAL_SECONDS: int = 60
    # ==========================================
    # CORS
    # ==========================================
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",")]
        return value

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()