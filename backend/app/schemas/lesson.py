from typing import Optional

from pydantic import BaseModel, Field, model_validator


# ==========================================
# LESSON CONTENT
# ==========================================

class LessonContentSchema(BaseModel):
    markdown: str
    html: str
    video_url: Optional[str] = None
    cover_image: Optional[str] = None


# ==========================================
# ADMIN CREATE LESSON
# ==========================================

class LessonCreateRequest(BaseModel):
    lesson_number: int = Field(..., ge=1)
    title: str
    short_description: str
    content: LessonContentSchema
    estimated_minutes: int = Field(5, ge=1)
    xp_reward: int = Field(50, ge=0)


# ==========================================
# UPDATE LESSON
# ==========================================

class LessonUpdateRequest(BaseModel):
    lesson_number: Optional[int] = None
    title: Optional[str] = None
    short_description: Optional[str] = None
    content: Optional[LessonContentSchema] = None
    estimated_minutes: Optional[int] = None
    xp_reward: Optional[int] = None
    is_published: Optional[bool] = None


# ==========================================
# PUBLISH LESSON
# ==========================================

class PublishLessonRequest(BaseModel):
    is_published: bool


class LessonProgressRequest(BaseModel):
    progress: float | None = Field(default=None, ge=0, le=100)
    watch_time: float | None = Field(default=None, ge=0)
    progress_percent: float | None = Field(default=None, ge=0, le=100)
    watch_time_seconds: float | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def normalize_legacy_fields(self):
        if self.progress is None:
            self.progress = self.progress_percent
        if self.watch_time is None:
            self.watch_time = self.watch_time_seconds
        if self.progress is None or self.watch_time is None:
            raise ValueError("progress and watch_time are required")
        return self


class YouTubeSyncRequest(BaseModel):
    url: str = Field(..., min_length=1)


# ==========================================
# REORDER LESSON
# ==========================================

class LessonOrderItem(BaseModel):
    lesson_id: str
    lesson_number: int


class LessonReorderRequest(BaseModel):
    lessons: list[LessonOrderItem]