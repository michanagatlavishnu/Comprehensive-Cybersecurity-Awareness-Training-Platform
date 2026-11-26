def otp_template(name: str, otp: str):
    return f"""
    <div style="font-family:Arial;background:#F8FAFC;padding:30px">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:14px">
            <h2 style="color:#2563EB;">CyberAware Email Verification</h2>

            <p>Hello <b>{name}</b>,</p>

            <p>Your One-Time Password is:</p>

            <div style="font-size:38px;font-weight:bold;color:#059669;letter-spacing:8px;padding:20px 0;">
                {otp}
            </div>

            <p>This OTP expires in <b>5 minutes</b>.</p>

            <hr/>

            <small>CyberAware Enterprise Security Platform</small>
        </div>
    </div>
    """


def reset_password_template(name: str, otp: str):
    return f"""
    <div style="font-family:Arial;background:#FFF7ED;padding:30px">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:14px">
            <h2 style="color:#DC2626;">Password Reset Request</h2>

            <p>Hello <b>{name}</b>,</p>

            <p>Your password reset OTP is:</p>

            <div style="font-size:38px;font-weight:bold;color:#DC2626;letter-spacing:8px;padding:20px 0;">
                {otp}
            </div>

            <p>This OTP expires in <b>5 minutes</b>.</p>

            <hr/>

            <small>CyberAware Enterprise Security Platform</small>
        </div>
    </div>
    """


def welcome_template(name: str):
    return f"""
    <div style="font-family:Arial;background:#ECFDF5;padding:30px">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:14px">
            <h2 style="color:#059669;">Welcome to CyberAware</h2>

            <p>Hello <b>{name}</b>,</p>

            <p>Your email has been verified successfully.</p>

            <p>You can now access AI-powered cybersecurity awareness training, phishing simulations, quizzes and certificates.</p>

            <hr/>

            <small>CyberAware Team</small>
        </div>
    </div>
    """