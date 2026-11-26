from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.user import User


class LearningActivity(Document):
    user: Link[User]
    activity_type: str
    course_title: str
    lesson_title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "learning_activities"
