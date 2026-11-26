from datetime import datetime
from beanie import Document, Link
from pydantic import Field

from app.models.user import User
from app.models.badge import Badge


class Achievement(Document):
    user: Link[User]
    badge: Link[Badge]

    unlocked_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "achievements"