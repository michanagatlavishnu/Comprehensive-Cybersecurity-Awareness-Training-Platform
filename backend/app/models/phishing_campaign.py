from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Document
from pydantic import Field


# ==========================================================
# Campaign Status
# ==========================================================

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    RUNNING = "running"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ==========================================================
# Difficulty
# ==========================================================

class PhishingDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


# ==========================================================
# Phishing Campaign Model
# ==========================================================

class PhishingCampaign(Document):

    title: str
    description: str

    department: str = "All"

    template_name: str = "gmail"

    difficulty: PhishingDifficulty = PhishingDifficulty.MEDIUM

    language: str = "en"

    ai_prompt: str

    status: CampaignStatus = CampaignStatus.DRAFT

    scheduled_at: Optional[datetime] = None

    launched_at: Optional[datetime] = None

    completed_at: Optional[datetime] = None

    total_targets: int = 0
    total_sent: int = 0

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "phishing_campaigns"