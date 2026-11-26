from datetime import datetime
from enum import Enum

from beanie import Document
from pydantic import Field


class ModuleDifficulty(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class ModuleCategory(str, Enum):
    PHISHING = "Phishing"
    PASSWORDS = "Passwords"
    SOCIAL_ENGINEERING = "Social Engineering"
    EMAIL_SECURITY = "Email Security"
    NETWORK_SECURITY = "Network Security"
    MOBILE_SECURITY = "Mobile Security"
    CLOUD_SECURITY = "Cloud Security"
    AI_SECURITY = "AI Security"
    INCIDENT_RESPONSE = "Incident Response"


class LearningModule(Document):
    title: str = Field(..., min_length=5, max_length=120)
    description: str
    category: ModuleCategory
    difficulty: ModuleDifficulty

    duration_minutes: int = Field(default=30, ge=5)
    xp_reward: int = Field(default=100, ge=20)

    thumbnail: str | None = None

    lessons_count: int = 0
    quiz_count: int = 0

    is_published: bool = True
    total_lessons: int = Field(default=0, ge=0)

    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "learning_modules"

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Phishing Awareness Fundamentals",
                "description": "Learn phishing attacks and how to identify them.",
                "category": "Phishing",
                "difficulty": "Beginner",
                "duration_minutes": 45,
                "xp_reward": 120,
                "thumbnail": "https://image-url.com/phishing.jpg",
                "is_published": True,
                "created_by": "admin_id"
            }
        }