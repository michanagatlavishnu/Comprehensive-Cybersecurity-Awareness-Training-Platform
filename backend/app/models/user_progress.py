from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.lesson import Lesson
from app.models.module import LearningModule
from app.models.user import User


class UserProgress(Document):
    user: Link[User]
    module: Link[LearningModule]
    lesson: Link[Lesson]

    completed: bool = False
    completed_at: datetime | None = None

    watch_time_seconds: float = 0
    progress_percent: float = 0
    last_watched_at: datetime | None = None

    xp_awarded: int = 0

    class Settings:
        name = "user_progress"

    class Config:
        json_schema_extra = {
            "example": {
                "completed": True,
                "xp_awarded": 50,
            }
        }

    async def mark_completed(self, xp: int):
        self.completed = True
        self.progress_percent = 100
        self.completed_at = datetime.utcnow()
        self.xp_awarded = xp
        await self.save()