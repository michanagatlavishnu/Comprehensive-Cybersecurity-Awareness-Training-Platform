from pydantic import BaseModel, EmailStr, Field

from app.utils.helpers.constants import Language


# -----------------------------------------
# Register
# -----------------------------------------

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=80)

    email: EmailStr

    password: str = Field(..., min_length=8)

    company: str | None = None
    department: str | None = None
    designation: str | None = None

    language: Language = Language.ENGLISH


# -----------------------------------------
# Login
# -----------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -----------------------------------------
# OTP Verification
# -----------------------------------------

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class ResendOTPRequest(BaseModel):
    email: EmailStr


# -----------------------------------------
# Forgot Password
# -----------------------------------------

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

    new_password: str = Field(..., min_length=8)


# -----------------------------------------
# Refresh Token
# -----------------------------------------

class RefreshTokenRequest(BaseModel):
    refresh_token: str


# -----------------------------------------
# User Response
# -----------------------------------------

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr

    role: str
    language: str

    company: str | None = None
    department: str | None = None
    designation: str | None = None

    awareness_score: int
    is_verified: bool
    is_active: bool


# -----------------------------------------
# Login Response
# -----------------------------------------

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    user: UserResponse


# -----------------------------------------
# Generic Message
# -----------------------------------------

class MessageResponse(BaseModel):
    success: bool = True
    message: str