from typing import Optional

from pydantic import BaseModel, Field


# ==========================================
# Date Filters
# ==========================================

class AnalyticsFilterRequest(BaseModel):
    department: Optional[str] = None
    quiz_id: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


# ==========================================
# Department Chart
# ==========================================

class DepartmentPerformanceSchema(BaseModel):
    department: str
    average_score: float
    users: int


# ==========================================
# Pass Rate Pie
# ==========================================

class PassRateSchema(BaseModel):
    passed: int
    failed: int
    percentage: float


# ==========================================
# Weak Topic Chart
# ==========================================

class WeakTopicSchema(BaseModel):
    topic: str
    average_score: float
    attempts: int
    difficulty: str


# ==========================================
# Employee History
# ==========================================

class EmployeeHistorySchema(BaseModel):
    date: str
    score: float
    quiz_title: str


# ==========================================
# Overview Cards
# ==========================================

class AnalyticsOverviewSchema(BaseModel):
    total_attempts: int
    total_users: int
    total_quizzes: int
    average_score: float
    pass_rate: float
    average_time_minutes: float