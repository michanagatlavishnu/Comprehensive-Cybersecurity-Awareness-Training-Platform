from datetime import datetime
from enum import Enum
from typing import List

from beanie import Document
from pydantic import BaseModel, Field


# =====================================================
# Difficulty
# =====================================================

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


# =====================================================
# Cybersecurity Topics
# =====================================================

class CyberTopic(str, Enum):
    PHISHING = "Phishing"
    PASSWORD = "Password Security"
    EMAIL = "Email Security"
    SOCIAL_ENGINEERING = "Social Engineering"
    NETWORK = "Network Security"
    MALWARE = "Malware"
    CLOUD = "Cloud Security"
    DATA_PRIVACY = "Data Privacy"
    MFA = "Multi Factor Authentication"
    GENERAL = "General Security"


# =====================================================
# Quiz Option
# =====================================================

class OptionModel(BaseModel):
    text: str
    is_correct: bool = False


# =====================================================
# Question
# =====================================================

class Question(Document):

    quiz_id: str

    question: str

    options: List[OptionModel]

    explanation: str

    topic: CyberTopic

    difficulty: Difficulty = Difficulty.MEDIUM

    marks: int = 5

    ai_generated: bool = False

    source_lesson: str | None = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "questions"