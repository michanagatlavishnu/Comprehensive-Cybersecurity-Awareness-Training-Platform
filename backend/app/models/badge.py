from datetime import datetime
from beanie import Document
from pydantic import Field


class Badge(Document):
    title: str = Field(..., max_length=60)
    description: str
    icon: str
    xp_reward: int

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "badges"