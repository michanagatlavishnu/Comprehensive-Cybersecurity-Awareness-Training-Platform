from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ==========================================
# Analytics Card Models
# ==========================================

class AnalyticsCard(BaseModel):
    title: str
    value: float | int
    change: float = 0
    icon: str


class ScoreTrendPoint(BaseModel):
    label: str
    score: float


class DepartmentScore(BaseModel):
    department: str
    average_score: float
    users: int
    attempts: int


class PassRate(BaseModel):
    passed: int
    failed: int
    percentage: float


class WeakTopic(BaseModel):
    topic: str
    average_score: float
    attempts: int
    difficulty: str


class TopPerformer(BaseModel):
    rank: int
    user_id: str
    full_name: str
    department: str
    xp: int
    average_score: float
    quizzes_completed: int


class EmployeeTopicScore(BaseModel):
    topic: str
    score: float


class EmployeeHistory(BaseModel):
    date: str
    score: float
    quiz_title: str


# ==========================================
# Complete Dashboard Response
# ==========================================

class QuizAnalyticsOverview(BaseModel):
    total_attempts: int
    average_score: float
    pass_rate: float
    total_quizzes: int
    active_users: int
    average_time_minutes: float
    highest_score: float
    lowest_score: float
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class DepartmentAnalyticsResponse(BaseModel):
    departments: List[DepartmentScore]


class TopPerformerResponse(BaseModel):
    performers: List[TopPerformer]


class WeakTopicResponse(BaseModel):
    weak_topics: List[WeakTopic]


class EmployeeAnalyticsResponse(BaseModel):
    history: List[EmployeeHistory]
    topic_scores: List[EmployeeTopicScore]
    average_score: float
    quizzes_completed: int
    certificates: int
    current_level: int
    xp: int