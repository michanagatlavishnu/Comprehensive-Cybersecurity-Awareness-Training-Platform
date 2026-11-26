from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Document, Link, Indexed
from pydantic import Field

from app.models.user import User


# ==========================================
# Chat Roles
# ==========================================

class ChatRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


# ==========================================
# Chat Message Model
# ==========================================

class ChatMessage(Document):

    # Conversation Owner
    user: Link[User]

    # Conversation Thread
    conversation_id: Indexed(str)

    # AI generated title
    conversation_title: Optional[str] = None

    # Current lesson/module context
    module_context: Optional[str] = None

    # Message
    role: ChatRole
    message: str

    # Metadata
    language: str = "en"

    tokens_used: int = 0

    response_time_ms: int = 0

    model_name: str = "llama-3.3-70b-versatile"

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_messages"

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "conv_001",
                "conversation_title": "Understanding Phishing",
                "module_context": "Phishing Awareness Fundamentals",
                "role": "user",
                "message": "Explain phishing in simple language.",
                "language": "en",
            }
        }