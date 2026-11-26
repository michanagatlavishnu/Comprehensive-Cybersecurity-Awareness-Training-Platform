from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Document, Link
from pydantic import Field

from app.models.phishing_email import PhishingEmail
from app.models.user import User


# ==========================================================
# Event Types
# ==========================================================

class EventType(str, Enum):
    DELIVERED = "delivered"
    OPENED = "opened"
    CLICKED = "clicked"
    REPORTED = "reported"
    CREDENTIALS_SUBMITTED = "credentials_submitted"
    CLASSIFIED = "classified"


# ==========================================================
# Phishing Event Model
# ==========================================================

class PhishingEvent(Document):

    phishing_email: Link[PhishingEmail]

    user: Link[User]

    event_type: EventType

    ip_address: Optional[str] = None

    browser: Optional[str] = None

    device: Optional[str] = None

    location: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "phishing_events"