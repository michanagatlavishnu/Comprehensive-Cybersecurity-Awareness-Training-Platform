import re

from app.core.exceptions import BadRequestException

# Password Rules:
# Minimum 8 characters
# One uppercase
# One lowercase
# One number
# One special character

PASSWORD_REGEX = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
)


def validate_password(password: str):
    if not PASSWORD_REGEX.fullmatch(password):
        raise BadRequestException(
            "Password must contain uppercase, lowercase, number and special character."
        )

    return password


def normalize_email(email: str):
    return email.strip().lower()