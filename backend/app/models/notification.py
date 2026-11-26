from datetime import datetime
from beanie import Document, Link
from pydantic import Field

from app.models.user import User


class Notification(Document):
    user: Link[User]

    title: str
    message: str

    type: str = "info"

    is_read: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"