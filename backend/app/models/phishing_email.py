from datetime import datetime
from typing import Optional

from beanie import Document, Link
from pydantic import Field

from app.models.phishing_campaign import PhishingCampaign
from app.models.user import User


# ==========================================================
# Individual Phishing Email
# ==========================================================

class PhishingEmail(Document):

    campaign: Link[PhishingCampaign]

    user: Link[User]

    tracking_token: str

    subject: str

    sender_name: str

    sender_email: str

    html_body: str

    language: str = "en"

    delivered: bool = False

    opened: bool = False
    clicked: bool = False
    reported: bool = False

    is_phishing: bool = True
    identified: bool = False
    identified_as_phishing: Optional[bool] = None
    decision_correct: Optional[bool] = None
    identified_at: Optional[datetime] = None
    simulation_round: int = 1

    credentials_submitted: bool = False

    opened_at: Optional[datetime] = None

    clicked_at: Optional[datetime] = None

    reported_at: Optional[datetime] = None

    credentials_at: Optional[datetime] = None

    sent_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "phishing_emails"