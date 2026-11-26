from app.models.otp import OTP
from app.core.otp import generate_otp, otp_expiry_time
from app.core.mail import send_email
from app.core.mail_templates import otp_template, reset_password_template
from app.core.exceptions import (
    InvalidOTPException,
    OTPExpiredException,
)
from app.utils.helpers.constants import (
    OTP_PURPOSE_REGISTER,
    OTP_PURPOSE_RESET,
)


class OTPService:

    # =====================================================
    # CREATE OTP
    # =====================================================
    @staticmethod
    async def create_otp(email: str, name: str, purpose: str):

        # Remove previous unused OTPs
        await OTP.find(
            OTP.email == email,
            OTP.purpose == purpose,
            OTP.is_used == False,
        ).delete()

        otp_code = generate_otp()

        otp = OTP(
            email=email,
            otp=otp_code,
            purpose=purpose,
            expires_at=otp_expiry_time(),
            is_used=False,
        )

        await otp.insert()

        # Print OTP in terminal (development)
        print("\n======================================")
        print(f"OTP CREATED")
        print(f"Email   : {email}")
        print(f"Purpose : {purpose}")
        print(f"OTP     : {otp_code}")
        print("======================================\n")

        if purpose == OTP_PURPOSE_REGISTER:
            subject = "CyberAware Email Verification OTP"
            html = otp_template(name, otp_code)
        else:
            subject = "CyberAware Password Reset OTP"
            html = reset_password_template(name, otp_code)

        await send_email(
            subject=subject,
            recipients=[email],
            html=html,
        )

        return otp_code

    # =====================================================
    # VERIFY OTP (WITHOUT CONSUMING)
    # Used by /verify-otp and /verify-reset-otp
    # =====================================================
    @staticmethod
    async def verify(email: str, otp_code: str, purpose: str):

        otp = await OTP.find_one(
            OTP.email == email,
            OTP.otp == otp_code,
            OTP.purpose == purpose,
            OTP.is_used == False,
        )

        if not otp:
            raise InvalidOTPException()

        if otp.expired:
            raise OTPExpiredException()

        # Don't mark OTP used here.
        return True

    # =====================================================
    # CONSUME OTP
    # Used only after successful registration/password reset.
    # =====================================================
    @staticmethod
    async def consume(email: str, otp_code: str, purpose: str):

        otp = await OTP.find_one(
            OTP.email == email,
            OTP.otp == otp_code,
            OTP.purpose == purpose,
            OTP.is_used == False,
        )

        if not otp:
            raise InvalidOTPException()

        if otp.expired:
            raise OTPExpiredException()

        otp.is_used = True
        await otp.save()

        return True

    # =====================================================
    # RESEND OTP
    # =====================================================
    @staticmethod
    async def resend(email: str, name: str, purpose: str):
        return await OTPService.create_otp(email, name, purpose)

    # =====================================================
    # CLEANUP OTPs
    # =====================================================
    @staticmethod
    async def cleanup(email: str, purpose: str):
        await OTP.find(
            OTP.email == email,
            OTP.purpose == purpose,
        ).delete()