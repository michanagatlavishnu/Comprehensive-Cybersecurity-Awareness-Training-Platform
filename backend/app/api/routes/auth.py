from fastapi import APIRouter

from app.api.controllers.auth_controller import AuthController
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    ResendOTPRequest,
    VerifyOTPRequest,
    VerifyResetOTPRequest,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


router.post(
    "/register",
    summary="Register Employee/Admin",
    description="Creates a new CyberAware account and sends Email OTP.",
)(
    AuthController.register
)

router.post(
    "/admin/register",
    summary="Register Initial Admin",
    description="Creates the initial Admin account and sends email OTP.",
)(AuthController.register_admin)

router.post(
    "/verify-email",
    summary="Verify Email OTP",
    description="Verify email using 6-digit OTP.",
)(
    AuthController.verify_email
)

router.post(
    "/resend-otp",
    summary="Resend Email OTP",
    description="Resend email verification OTP.",
)(
    AuthController.resend_otp
)

router.post(
    "/login",
    summary="Login User",
    description="Login with verified email and password.",
)(
    AuthController.login
)

router.post(
    "/refresh-token",
    summary="Refresh Access Token",
    description="Generate a new access token using refresh token.",
)(
    AuthController.refresh_token
)

router.post(
    "/forgot-password",
    summary="Forgot Password",
    description="Send OTP to reset password.",
)(
    AuthController.forgot_password
)

router.post(
    "/verify-reset-otp",
    summary="Verify Password Reset OTP",
)(
    AuthController.verify_reset_otp
)

router.post(
    "/reset-password",
    summary="Reset Password",
)(
    AuthController.reset_password
)

router.get(
    "/me",
    summary="Get Current User",
)(
    AuthController.me
)

router.post(
    "/logout",
    summary="Logout User",
)(
    AuthController.logout
)

router.post(
    "/verify-otp",
    summary="Verify Email OTP (Alias)",
    description="Backward-compatible alias for verify-email.",
)(
    AuthController.verify_email
)