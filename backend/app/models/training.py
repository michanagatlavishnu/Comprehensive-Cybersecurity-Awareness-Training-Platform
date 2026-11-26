from datetime import datetime
from enum import Enum
from typing import Annotated, List

from beanie import Document, Indexed
from pydantic import Field


# ==========================================
# MODULE CATEGORY
# ==========================================

class ModuleCategory(str, Enum):
    PHISHING = "phishing"
    PASSWORDS = "passwords"
    EMAIL_SECURITY = "email_security"
    SOCIAL_ENGINEERING = "social_engineering"
    NETWORK_SECURITY = "network_security"
    DATA_PRIVACY = "data_privacy"
    MOBILE_SECURITY = "mobile_security"
    CLOUD_SECURITY = "cloud_security"
    MALWARE = "malware"
    GENERAL = "general"


# ==========================================
# MODULE DIFFICULTY
# ==========================================

class ModuleDifficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# ==========================================
# TRAINING MODULE MODEL
# ==========================================

class TrainingModule(Document):
    title: Annotated[str, Indexed(unique=True)]

    description: str

    category: ModuleCategory = ModuleCategory.GENERAL
    difficulty: ModuleDifficulty = ModuleDifficulty.BEGINNER

    thumbnail: str | None = None

    estimated_minutes: int = Field(default=15, ge=1)

    xp_reward: int = Field(default=100, ge=0)

    total_lessons: int = 0

    tags: List[str] = Field(default_factory=list)

    is_published: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "training_modules"

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Phishing Awareness Fundamentals",
                "description": "Learn how phishing attacks work and how to identify them.",
                "category": "phishing",
                "difficulty": "beginner",
                "thumbnail": "/uploads/modules/phishing.png",
                "estimated_minutes": 30,
                "xp_reward": 150,
                "tags": ["phishing", "email", "security"],
                "is_published": True,
            }
        }
    }

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return await super().save(*args, **kwargs)