from datetime import datetime

from beanie import Document
from pydantic import Field


class TranslationCache(Document):

    source_text: str

    translated_text: str

    language: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "translation_cache"