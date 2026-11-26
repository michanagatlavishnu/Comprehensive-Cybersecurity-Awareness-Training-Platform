from fastapi_mail import FastMail, ConnectionConfig, MessageSchema, MessageType
from app.core.config import settings

mail_config = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

fast_mail = FastMail(mail_config)


async def send_email(subject: str, recipients: list[str], html: str):
    """
    Sends email using Gmail SMTP.
    If SMTP fails during development, it prints the error instead of crashing.
    """
    if (
        settings.ENVIRONMENT == "development"
        and (
            settings.MAIL_SERVER in {"localhost", "127.0.0.1"}
            or settings.MAIL_USERNAME == "local-placeholder"
        )
    ):
        print(f"Development mode: email delivery skipped for {recipients[0]}")
        return

    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=html,
        subtype=MessageType.html,
    )

    try:
        await fast_mail.send_message(message)
        print(f"✅ Email sent successfully to {recipients[0]}")

    except Exception as e:
        print("❌ SMTP ERROR:", e)

        # Don't crash during development
        if settings.ENVIRONMENT == "development":
            print("⚠ Running in development mode. Email not sent.")
            return

        raise


async def send_otp_email(email: str, otp: str):
    print(f"📧 EMAIL OTP for {email}: {otp}")

    html = f"""
    <div style="font-family:Arial;padding:30px;background:#F8FAFC;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:30px;">
        <h2 style="color:#2563EB;">CyberAware Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:8px;color:#059669;">{otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    </div>
    """

    await send_email(
        subject="CyberAware Email Verification OTP",
        recipients=[email],
        html=html,
    )


async def send_password_reset_email(email: str, otp: str):
    print(f"🔑 RESET OTP for {email}: {otp}")

    html = f"""
    <div style="font-family:Arial;padding:30px;background:#F8FAFC;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:30px;">
        <h2 style="color:#DC2626;">Reset Your CyberAware Password</h2>
        <p>Your password reset OTP is:</p>
        <h1 style="letter-spacing:8px;color:#DC2626;">{otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      </div>
    </div>
    """

    await send_email(
        subject="CyberAware Password Reset OTP",
        recipients=[email],
        html=html,
    )


async def send_welcome_email(email: str, name: str):
    html = f"""
    <div style="font-family:Arial;padding:30px;background:#F8FAFC;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:30px;">
        <h2 style="color:#059669;">Welcome to CyberAware</h2>
        <p>Hello <b>{name}</b>,</p>
        <p>Your email has been verified successfully.</p>
        <p>Welcome to CyberAware Enterprise Security Platform.</p>
      </div>
    </div>
    """

    await send_email(
        subject="Welcome to CyberAware",
        recipients=[email],
        html=html,
    )