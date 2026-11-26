from datetime import datetime
from typing import List

from beanie import Document
from pydantic import BaseModel, Field


class DepartmentScoreModel(BaseModel):
    department: str
    average_score: float = 0
    users: int = 0
    attempts: int = 0


class WeakTopicModel(BaseModel):
    topic: str
    average_score: float = 0
    attempts: int = 0
    difficulty: str = "medium"


class TopPerformerModel(BaseModel):
    user_id: str
    full_name: str
    department: str
    average_score: float
    xp: int
    quizzes_completed: int


class QuizAnalytics(Document):
    total_attempts: int = 0
    total_quizzes: int = 0
    active_users: int = 0

    average_score: float = 0
    pass_rate: float = 0

    highest_score: float = 0
    lowest_score: float = 0
    average_time_minutes: float = 0

    department_scores: List[DepartmentScoreModel] = Field(default_factory=list)
    weak_topics: List[WeakTopicModel] = Field(default_factory=list)
    top_performers: List[TopPerformerModel] = Field(default_factory=list)

    generated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quiz_analytics"