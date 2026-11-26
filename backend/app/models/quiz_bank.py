from datetime import datetime
from typing import List

from beanie import Document, Link
from pydantic import Field

from app.models.quiz import Quiz
from app.models.training import TrainingModule


class QuizBank(Document):

    module: Link[TrainingModule]
    quiz: Link[Quiz]

    question: str

    options: List[str]

    answer: str

    explanation: str

    difficulty: str

    ai_generated: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quiz_bank"