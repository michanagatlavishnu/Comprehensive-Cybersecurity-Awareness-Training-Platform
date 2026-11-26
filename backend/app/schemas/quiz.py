from typing import Optional
from pydantic import BaseModel, Field

class CreateQuizRequest(BaseModel):
    module_id: str
    lesson_id: str

    title: str
    description: str

    difficulty: str = "beginner"

    time_limit_minutes: int = Field(default=15, ge=1)

    passing_score: int = Field(default=70, ge=40, le=100)

    xp_reward: int = Field(default=100, ge=0)


class UpdateQuizRequest(BaseModel):
    lesson_id: Optional[str] = None

    title: Optional[str] = None
    description: Optional[str] = None

    difficulty: Optional[str] = None

    time_limit_minutes: Optional[int] = Field(default=None, ge=1)

    passing_score: Optional[int] = Field(default=None, ge=40, le=100)

    xp_reward: Optional[int] = Field(default=None, ge=0)

    is_published: Optional[bool] = None