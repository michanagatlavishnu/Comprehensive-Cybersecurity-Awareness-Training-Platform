from datetime import datetime
from enum import Enum
from typing import Optional

from beanie import Document
from pydantic import Field


# ==========================================================
# Landing Page Types
# ==========================================================

class LandingPageType(str, Enum):
    GMAIL = "gmail"
    MICROSOFT = "microsoft"
    BANK = "bank"
    OTP = "otp"
    PASSWORD_RESET = "password_reset"


# ==========================================================
# Landing Page Model
# ==========================================================

class PhishingLandingPage(Document):

    page_name: str

    page_type: LandingPageType

    title: str

    html_content: str

    css_content: Optional[str] = None

    language: str = "en"

    is_active: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "phishing_landing_pages"