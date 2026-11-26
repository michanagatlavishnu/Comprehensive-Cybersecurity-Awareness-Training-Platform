from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Document, Indexed, Link
from pydantic import BaseModel, Field

from app.models.module import LearningModule


# ==========================================
# LESSON CONTENT BLOCK
# ==========================================

class LessonContent(BaseModel):
    markdown: str = ""
    html: str = ""
    video_url: Optional[str] = None
    cover_image: Optional[str] = None


# ==========================================
# LESSON STATUS
# ==========================================

class LessonStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


# ==========================================
# LESSON MODEL
# ==========================================

class Lesson(Document):
    module: Link[LearningModule]

    lesson_number: int = Field(..., ge=1)
    title: Indexed(str, unique=False)

    short_description: str = ""
    content: LessonContent

    estimated_minutes: int = 5
    xp_reward: int = 50

    is_published: bool = False
    status: LessonStatus = LessonStatus.DRAFT

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "lessons"

    class Config:
        json_schema_extra = {
            "example": {
                "lesson_number": 1,
                "title": "Introduction to Phishing",
                "short_description": "Learn phishing attack basics.",
                "content": {
                    "markdown": "# Welcome",
                    "html": "<h1>Welcome</h1>",
                    "video_url": "https://youtube.com/watch?v=xxxxx",
                    "cover_image": "/uploads/phishing.jpg",
                },
                "estimated_minutes": 10,
                "xp_reward": 50,
            }
        }

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return await super().save(*args, **kwargs)