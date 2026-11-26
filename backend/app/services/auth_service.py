from datetime import datetime, timezone

from app.core.exceptions import (
    BadRequestException,
    ConflictException,
    UnauthorizedException,
)
from app.core.mail import send_welcome_email
from app.core.security.jwt import (
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.core.security.password import (
    hash_password,
    verify_password,
)
from app.models.user import User
from app.models.user import UserRole
from app.services.otp_service import OTPService
from app.utils.helpers.constants import (
    OTP_PURPOSE_REGISTER,
    OTP_PURPOSE_RESET,
)
from app.validators.auth import normalize_email, validate_password


class AuthService:
    # -------------------------------------------------------
    # REGISTER
    # -------------------------------------------------------
    @staticmethod
    async def register(payload):
        email = normalize_email(payload.email)

        validate_password(payload.password)

        existing_user = await User.find_one(User.email == email)

        if existing_user:
            raise ConflictException("Email already registered.")

        user = User(
            full_name=payload.full_name,
            email=email,
            password=hash_password(payload.password),
            company=payload.company,
            department=payload.department,
            designation=payload.designation,
            language=payload.language,
        )

        await user.insert()

        otp_code = await OTPService.create_otp(
            email=email,
            name=user.full_name,
            purpose=OTP_PURPOSE_REGISTER,
        )

        return user, otp_code

    @staticmethod
    async def register_admin(payload, require_existing_admin: bool = False):
        existing_admin = await User.find_one(User.role == UserRole.ADMIN)
        if existing_admin and not require_existing_admin:
            raise BadRequestException(
                "An Admin already exists. Ask an existing Admin to create another Admin."
            )
        if require_existing_admin and not existing_admin:
            raise BadRequestException("Create the initial Admin through the public Admin signup first.")

        email = normalize_email(payload.email)
        validate_password(payload.password)
        if await User.find_one(User.email == email):
            raise ConflictException("Email already registered.")

        user = User(
            full_name=payload.full_name,
            email=email,
            password=hash_password(payload.password),
            company=payload.company,
            department=payload.department,
            designation=payload.designation,
            language=payload.language,
            role=UserRole.ADMIN,
        )
        await user.insert()
        if require_existing_admin:
            user.is_verified = True
            await user.save()
            return user

        await OTPService.create_otp(email=email, name=user.full_name, purpose=OTP_PURPOSE_REGISTER)
        return user

    # -------------------------------------------------------
    # VERIFY EMAIL OTP
    # -------------------------------------------------------
    @staticmethod
    async def verify_email(email: str, otp: str):

        email = normalize_email(email)

        await OTPService.verify(
            email=email,
            otp_code=otp,
            purpose=OTP_PURPOSE_REGISTER,
        )

        user = await User.find_one(User.email == email)

        if not user:
            raise BadRequestException("User not found.")

        user.is_verified = True

        await user.save()

        await send_welcome_email(
            email=user.email,
            name=user.full_name,
        )

        access = create_access_token(str(user.id), user.role.value)
        refresh = create_refresh_token(str(user.id))

        user.refresh_token = refresh

        await user.save()

        return {
             "access_token": access,
             "refresh_token": refresh,
             "token_type": "Bearer",
             "user": {
                 "id": str(user.id),
                 "full_name": user.full_name,
                 "email": user.email,
                 "role": user.role.value,
                 "language": user.language.value,
                 "company": user.company,
                 "department": user.department,
                 "designation": user.designation,
                 "awareness_score": user.awareness_score,
                 "is_verified": user.is_verified,
                 "is_active": user.is_active,
             },
        }

    # -------------------------------------------------------
    # RESEND OTP
    # -------------------------------------------------------
    @staticmethod
    async def resend_otp(email: str):

        email = normalize_email(email)

        user = await User.find_one(User.email == email)

        if not user:
            raise BadRequestException("User not found.")

        if user.is_verified:
            raise BadRequestException("Email already verified.")

        otp_code = await OTPService.resend(
            email=email,
            name=user.full_name,
            purpose=OTP_PURPOSE_REGISTER,
        )

        return otp_code

    # -------------------------------------------------------
    # LOGIN
    # -------------------------------------------------------
    @staticmethod
    async def login(email: str, password: str):

        email = normalize_email(email)

        user = await User.find_one(User.email == email)

        if not user:
            raise UnauthorizedException("Invalid email or password.")

        if not verify_password(password, user.password):
            raise UnauthorizedException("Invalid email or password.")

        if not user.is_verified:
            raise UnauthorizedException("Verify your email first.")

        if not user.is_active:
            raise UnauthorizedException("Account disabled.")

        access = create_access_token(str(user.id), user.role.value)
        refresh = create_refresh_token(str(user.id))

        user.refresh_token = refresh
        user.last_login = datetime.now(timezone.utc)

        await user.save()

        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "Bearer",
            "user": {
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role.value,
                "language": user.language.value,
                "company": user.company,
                "department": user.department,
                "designation": user.designation,
                "awareness_score": user.awareness_score,
                "is_verified": user.is_verified,
                "is_active": user.is_active,
            },
        }

    # -------------------------------------------------------
    # REFRESH TOKEN
    # -------------------------------------------------------
    @staticmethod
    async def refresh(refresh_token: str):

        payload = verify_token(refresh_token)

        if not payload:
            raise UnauthorizedException("Invalid refresh token.")

        if payload.get("type") != "refresh":
            raise UnauthorizedException("Refresh token required.")

        user = await User.get(payload["sub"])

        if not user:
            raise UnauthorizedException("User not found.")

        if user.refresh_token != refresh_token:
            raise UnauthorizedException("Refresh token expired.")

        access = create_access_token(str(user.id), user.role.value)

        return {
            "access_token": access,
            "refresh_token": refresh_token,
            "user": user,
        }

    # -------------------------------------------------------
    # FORGOT PASSWORD
    # -------------------------------------------------------
    @staticmethod
    async def forgot_password(email: str):

        email = normalize_email(email)

        user = await User.find_one(User.email == email)

        if not user:
            raise BadRequestException("User not found.")

        otp_code = await OTPService.create_otp(
            email=email,
            name=user.full_name,
            purpose=OTP_PURPOSE_RESET,
        )

        return otp_code

    # -------------------------------------------------------
    # VERIFY RESET OTP
    # -------------------------------------------------------
    # -------------------------------------------------------
# VERIFY RESET OTP
# -------------------------------------------------------
    @staticmethod
    async def verify_reset_otp(email: str, otp: str):
        email = normalize_email(email)

        # Only check that user exists.
        user = await User.find_one(User.email == email)

        if not user:
            raise BadRequestException("User not found.")

        # Don't consume OTP here.
        return True

    # -------------------------------------------------------
    # RESET PASSWORD
    # -------------------------------------------------------
    @staticmethod
    async def reset_password(
        email: str,
        otp: str,
        new_password: str,
    ):

        email = normalize_email(email)

        validate_password(new_password)

        await OTPService.verify(
            email=email,
            otp_code=otp,
            purpose=OTP_PURPOSE_RESET,
        )

        user = await User.find_one(User.email == email)

        if not user:
            raise BadRequestException("User not found.")

        user.password = hash_password(new_password)

        user.refresh_token = None

        await user.save()

        return True

    # -------------------------------------------------------
    # CURRENT USER
    # -------------------------------------------------------
    @staticmethod
    async def me(current_user: User):
        return {
            "id": str(current_user.id),
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role.value,
            "language": current_user.language.value,
            "company": current_user.company,
            "department": current_user.department,
            "designation": current_user.designation,
            "awareness_score": current_user.awareness_score,
            "is_verified": current_user.is_verified,
            "is_active": current_user.is_active,
        }

    # -------------------------------------------------------
    # LOGOUT
    # -------------------------------------------------------
    @staticmethod
    async def logout(current_user: User):

        current_user.refresh_token = None

        await current_user.save()

        return True