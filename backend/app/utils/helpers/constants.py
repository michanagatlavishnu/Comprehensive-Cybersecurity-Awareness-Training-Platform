from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"


class Language(str, Enum):
    ENGLISH = "en"
    HINDI = "hi"
    TELUGU = "te"


class QuizDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class TrainingStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class CertificateStatus(str, Enum):
    GENERATED = "generated"
    VERIFIED = "verified"


OTP_LENGTH = 6

OTP_PURPOSE_REGISTER = "register"
OTP_PURPOSE_RESET = "password_reset"

DEFAULT_PROFILE_IMAGE = (
    "https://ui-avatars.com/api/?background=0D8ABC&color=fff"
)

MAX_PHISHING_SCORE = 100
MAX_AWARENESS_SCORE = 100

XP_PER_MODULE = 50
XP_PER_QUIZ = 25
XP_PER_CERTIFICATE = 150