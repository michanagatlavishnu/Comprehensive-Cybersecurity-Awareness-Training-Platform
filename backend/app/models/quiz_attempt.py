from datetime import datetime
from typing import List

from beanie import Document, Link
from pydantic import BaseModel, Field

from app.models.user import User
from app.models.quiz import Quiz


# =====================================================
# Per Question Result
# =====================================================

class QuestionResult(BaseModel):

    question_id: str

    topic: str

    selected_option: int

    correct_option: int

    is_correct: bool

    marks_awarded: int

    explanation: str | None = None


# =====================================================
# Quiz Attempt
# =====================================================

class QuizAttempt(Document):

    user: Link[User]

    quiz: Link[Quiz]

    score: float

    total_marks: int

    percentage: float

    passed: bool

    xp_awarded: int = 0

    duration_minutes: float = 0

    language: str = "en"

    ai_generated: bool = False

    answers: List[QuestionResult] = []

    completed_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quiz_attempts"