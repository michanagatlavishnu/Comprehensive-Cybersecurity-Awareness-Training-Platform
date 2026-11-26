from pydantic import BaseModel, Field

from app.models.module import ModuleCategory, ModuleDifficulty


class ModuleCreateRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=120)
    description: str
    category: ModuleCategory
    difficulty: ModuleDifficulty
    duration_minutes: int = Field(default=30, ge=5)
    xp_reward: int = Field(default=100, ge=20)
    thumbnail: str | None = None
    is_published: bool = True


class ModuleUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    category: ModuleCategory | None = None
    difficulty: ModuleDifficulty | None = None
    duration_minutes: int | None = None
    xp_reward: int | None = None
    thumbnail: str | None = None
    is_published: bool | None = None