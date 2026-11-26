from fastapi import Depends, status

from app.dependencies.auth import CurrentUser, CurrentAdmin
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
from app.services.auth_service import AuthService
from app.utils.response.api_response import success_response
from app.core.config import settings


class AuthController:

    @staticmethod
    async def register(payload: RegisterRequest):
        user, otp_code = await AuthService.register(payload)
        data = {
            "email": user.email,
            "is_verified": user.is_verified,
        }
        if settings.ENVIRONMENT == "development" and settings.EXPOSE_DEVELOPMENT_OTP:
            data["development_otp"] = otp_code

        return success_response(
            message="Registration successful. OTP sent to email.",
            data=data,
        )

    @staticmethod
    async def verify_email(payload: VerifyOTPRequest):
        result = await AuthService.verify_email(
            email=payload.email,
            otp=payload.otp,
        )

        return success_response(
            message="Email verified successfully.",
            data=result,
        )

    @staticmethod
    async def resend_otp(payload: ResendOTPRequest):
        otp_code = await AuthService.resend_otp(payload.email)
        data = None
        if settings.ENVIRONMENT == "development" and settings.EXPOSE_DEVELOPMENT_OTP:
            data = {"development_otp": otp_code}

        return success_response(
            message="OTP sent successfully.",
            data=data,
        )

    @staticmethod
    async def login(payload: LoginRequest):
        result = await AuthService.login(
            email=payload.email,
            password=payload.password,
        )

        return success_response(
            message="Login successful.",
            data=result,
        )

    @staticmethod
    async def refresh_token(payload: RefreshTokenRequest):
        result = await AuthService.refresh(payload.refresh_token)

        return success_response(
            message="Access token refreshed.",
            data=result,
        )

    @staticmethod
    async def forgot_password(payload: ForgotPasswordRequest):
        otp_code = await AuthService.forgot_password(payload.email)
        data = None
        if settings.ENVIRONMENT == "development" and settings.EXPOSE_DEVELOPMENT_OTP:
            data = {"development_otp": otp_code}

        return success_response(
            message="Password reset OTP sent.",
            data=data,
        )

    @staticmethod
    async def verify_reset_otp(payload: VerifyResetOTPRequest):
        await AuthService.verify_reset_otp(
            email=payload.email,
            otp=payload.otp,
        )

        return success_response(
            message="OTP verified successfully.",
        )

    @staticmethod
    async def reset_password(payload: ResetPasswordRequest):
        await AuthService.reset_password(
            email=payload.email,
            otp=payload.otp,
            new_password=payload.new_password,
        )

        return success_response(
            message="Password reset successful.",
        )

    @staticmethod
    async def me(current_user=Depends(CurrentUser)):
        user = await AuthService.me(current_user)

        return success_response(
            message="Current user fetched successfully.",
            data=user,
        )

    @staticmethod
    async def logout(current_user=Depends(CurrentUser)):
        await AuthService.logout(current_user)

        return success_response(
            message="Logout successful.",
        )

    @staticmethod
    async def register_admin(payload: RegisterRequest):
        user = await AuthService.register_admin(payload)
        return success_response(
            message="Admin registration successful. OTP sent to email.",
            data={"email": user.email, "is_verified": user.is_verified},
        )

    @staticmethod
    async def register_admin_by_admin(
        payload: RegisterRequest,
        current_admin: CurrentAdmin,
    ):
        user = await AuthService.register_admin(payload, require_existing_admin=True)
        return success_response(
            message="Admin created successfully. OTP sent to email.",
            data={"email": user.email, "is_verified": user.is_verified},
        )