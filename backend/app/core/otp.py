import random
from datetime import datetime, timedelta, timezone

from app.core.config import settings


def generate_otp() -> str:
    import secrets

    return str(secrets.randbelow(900000) + 100000)


def otp_expiry_time():
    # Store naive UTC datetime
    return datetime.utcnow() + timedelta(minutes=5)


def is_otp_expired(expiry_time: datetime):
    return datetime.utcnow() > expiry_time