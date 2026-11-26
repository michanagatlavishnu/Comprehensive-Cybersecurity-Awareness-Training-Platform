from pydantic import BaseModel


class LearningActivityRequest(BaseModel):
    activity_type: str
    course_title: str
    lesson_title: str
from pydantic import BaseModel


class DashboardStats(BaseModel):
    awareness_score: int
    xp: int
    level: int

    completed_modules: int
    completed_quizzes: int
    phishing_reports: int

    certificates: int


class AdminDashboardStats(BaseModel):
    total_users: int
    verified_users: int
    active_users: int

    total_modules: int
    total_quizzes: int

    phishing_campaigns: int
    certificates_generated: int

    average_awareness_score: float