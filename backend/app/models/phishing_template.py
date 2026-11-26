from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Document
from pydantic import Field


# ==========================================================
# Template Category
# ==========================================================

class TemplateCategory(str, Enum):
    GMAIL = "gmail"
    MICROSOFT = "microsoft"
    HR = "hr"
    BANK = "bank"
    OTP = "otp"
    COURIER = "courier"
    AMAZON = "amazon"
    INVOICE = "invoice"
    PASSWORD_RESET = "password_reset"
    GOOGLE_DRIVE = "google_drive"
    SLACK = "slack"
    ZOOM = "zoom"


# ==========================================================
# Template Model
# ==========================================================

class PhishingTemplate(Document):

    name: str

    category: TemplateCategory

    subject_template: str

    sender_name: str

    sender_email: str

    html_template: str

    difficulty: str = "medium"

    language: str = "en"

    is_ai_generated: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "phishing_templates"