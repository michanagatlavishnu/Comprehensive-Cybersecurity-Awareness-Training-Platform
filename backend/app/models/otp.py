from datetime import datetime, timezone

from beanie import Document, Indexed
from pydantic import EmailStr, Field

from app.utils.helpers.constants import (
    OTP_PURPOSE_REGISTER,
    OTP_PURPOSE_RESET,
)


class OTP(Document):
    email: Indexed(EmailStr)
    otp: str = Field(..., min_length=6, max_length=6)

    purpose: str = OTP_PURPOSE_REGISTER

    is_used: bool = False

    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "otps"

    @property
    def expired(self) -> bool:
        """
        MongoDB returns naive UTC datetimes.
        Convert both values to naive UTC before comparing.
        """
        now = datetime.utcnow()

        expires = self.expires_at

        if expires.tzinfo is not None:
            expires = expires.astimezone(timezone.utc).replace(tzinfo=None)

        return now > expires