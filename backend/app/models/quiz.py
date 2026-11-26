from datetime import datetime
from typing import Optional

from beanie import Document, Link
from pydantic import Field

from app.models.module import LearningModule
from app.models.lesson import Lesson


class Quiz(Document):
    module: Link[LearningModule]
    lesson: Link[Lesson]

    title: str
    description: str

    difficulty: str = "beginner"

    time_limit_minutes: int = 15
    passing_score: int = 70
    xp_reward: int = 100

    total_questions: int = 0
    is_published: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quizzes"