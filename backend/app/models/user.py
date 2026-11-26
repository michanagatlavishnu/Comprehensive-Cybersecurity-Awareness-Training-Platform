from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field

from app.utils.helpers.constants import Language, UserRole


class XPStats(BaseModel):
    total_xp: int = 0
    current_level: int = 1
    completed_modules: int = 0
    completed_quizzes: int = 0
    phishing_reports: int = 0


class User(Document):
    # Basic Info
    full_name: str = Field(..., min_length=3, max_length=80)
    email: Indexed(EmailStr, unique=True)
    password: str

    # Account
    role: UserRole = UserRole.EMPLOYEE
    language: Language = Language.ENGLISH

    is_verified: bool = False
    is_active: bool = True

    # Profile
    company: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    profile_image: Optional[str] = None

    # Security
    last_login: Optional[datetime] = None
    refresh_token: Optional[str] = None

    # Learning
    awareness_score: int = 0
    xp: XPStats = XPStats()

    # Audit
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Anil Kumar",
                "email": "anil@gmail.com",
                "role": "employee",
                "language": "en",
            }
        }

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)