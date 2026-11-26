from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.module import LearningModule
from app.models.user import User


class Certificate(Document):
    user: Link[User]
    module: Link[LearningModule]

    certificate_number: str

    issued_at: datetime = Field(default_factory=datetime.utcnow)

    score: int = 100

    is_downloaded: bool = False

    class Settings:
        name = "certificates"