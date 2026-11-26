from app.models.phishing_event import (
    PhishingEvent,
    EventType,
)


class PhishingTrackingService:

    # ==========================================
    # Detect Browser & Device
    # ==========================================
    @staticmethod
    def detect_device(user_agent: str):
        ua = user_agent.lower()

        browser = "Unknown"

        if "edg" in ua:
            browser = "Edge"
        elif "chrome" in ua:
            browser = "Chrome"
        elif "firefox" in ua:
            browser = "Firefox"
        elif "safari" in ua:
            browser = "Safari"

        device = (
            "Mobile"
            if "mobile" in ua
            else "Desktop"
        )

        return browser, device

    # ==========================================
    # Track Email Open
    # ==========================================
    @staticmethod
    async def track_open(email, request):

        user_agent = request.headers.get("user-agent", "")

        browser, device = (
            PhishingTrackingService.detect_device(
                user_agent
            )
        )

        ip = (
            request.client.host
            if request.client
            else "Unknown"
        )

        await PhishingEvent(
            phishing_email=email,
            user=email.user,
            event_type=EventType.OPENED,
            browser=browser,
            device=device,
            ip_address=ip,
        ).insert()

    # ==========================================
    # Track Click
    # ==========================================
    @staticmethod
    async def track_click(email, request):

        user_agent = request.headers.get("user-agent", "")

        browser, device = (
            PhishingTrackingService.detect_device(
                user_agent
            )
        )

        ip = (
            request.client.host
            if request.client
            else "Unknown"
        )

        await PhishingEvent(
            phishing_email=email,
            user=email.user,
            event_type=EventType.CLICKED,
            browser=browser,
            device=device,
            ip_address=ip,
        ).insert()

    # ==========================================
    # Track Credential Submission
    # ==========================================
    @staticmethod
    async def track_credentials(email, request):

        user_agent = request.headers.get("user-agent", "")

        browser, device = (
            PhishingTrackingService.detect_device(
                user_agent
            )
        )

        ip = (
            request.client.host
            if request.client
            else "Unknown"
        )

        await PhishingEvent(
            phishing_email=email,
            user=email.user,
            event_type=EventType.CREDENTIALS_SUBMITTED,
            browser=browser,
            device=device,
            ip_address=ip,
        ).insert()

    # ==========================================
    # Track Report
    # ==========================================
    @staticmethod
    async def track_report(email, request):

        user_agent = request.headers.get("user-agent", "")

        browser, device = (
            PhishingTrackingService.detect_device(
                user_agent
            )
        )

        ip = (
            request.client.host
            if request.client
            else "Unknown"
        )

        await PhishingEvent(
            phishing_email=email,
            user=email.user,
            event_type=EventType.REPORTED,
            browser=browser,
            device=device,
            ip_address=ip,
        ).insert()