from fastapi import Depends, Request
from app.models.phishing_email import PhishingEmail
from app.services.phishing_template_service import PhishingTemplateService

from app.dependencies.auth import (
    CurrentAdmin,
    CurrentUser,
)
from app.schemas.phishing import (
    CreatePhishingCampaignRequest,
    GeneratePhishingPreviewRequest,
    LaunchCampaignRequest,
    ScheduleCampaignRequest,
    CredentialSubmissionRequest,
    PhishingDecisionRequest,
)
from app.services.phishing_service import PhishingService
from app.services.phishing_scheduler_service import (
    PhishingSchedulerService,
)
from app.utils.response.api_response import success_response
from fastapi.responses import HTMLResponse
from app.services.phishing_report_service import PhishingReportService
from app.core.config import settings
class PhishingController:

    # ===========================
    # ADMIN
    # ===========================

    @staticmethod
    async def create_campaign(
        payload: CreatePhishingCampaignRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Campaign created successfully.",
            data=await PhishingService.create_campaign(payload),
        )

    @staticmethod
    async def preview_email(
        payload: GeneratePhishingPreviewRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Preview generated successfully.",
            data=await PhishingService.generate_email_preview(payload),
        )

    @staticmethod
    async def launch_campaign(
        payload: LaunchCampaignRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Campaign launched successfully.",
            data=await PhishingService.launch_campaign(payload),
        )

    @staticmethod
    async def schedule_campaign(
        payload: ScheduleCampaignRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Campaign scheduled successfully.",
            data=await PhishingSchedulerService.schedule_campaign(
                payload.campaign_id,
                payload.scheduled_at,
            ),
        )

    @staticmethod
    async def analytics(current_admin: CurrentAdmin):
        return success_response(
            message="Analytics fetched successfully.",
            data=await PhishingService.analytics(),
        )

    # ===========================
    # EMPLOYEE
    # ===========================

    @staticmethod
    async def inbox(current_user: CurrentUser):
        return success_response(
            message="Inbox fetched successfully.",
            data=await PhishingService.inbox(current_user),
        )

    @staticmethod
    async def history(current_user: CurrentUser):
        return success_response(
            message="History fetched successfully.",
            data=await PhishingService.employee_history(current_user),
        )

    @staticmethod
    async def report_email(
        token: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Email reported successfully.",
            data=await PhishingService.report_email(token, current_user),
        )

    @staticmethod
    async def open_email(
        token: str,
        request: Request,
    ):
        return success_response(
            message="Email opened.",
            data=await PhishingService.open_email(token),
        )

    @staticmethod
    async def click_email(
        token: str,
        request: Request,
    ):
        return success_response(
            message="Click tracked.",
            data=await PhishingService.click_email(token),
        )

    @staticmethod
    async def submit_credentials(
        payload: CredentialSubmissionRequest,
    ):
        return success_response(
            message="Credentials submitted.",
            data=await PhishingService.submit_credentials(payload),
        )
        
        
    @staticmethod
    async def landing_page(token: str):

        email = await PhishingEmail.find_one(
            PhishingEmail.tracking_token == token
        )

        if not email:
            return HTMLResponse("<h1>Invalid Link</h1>", status_code=404)

        await email.fetch_link(PhishingEmail.campaign)

        html = PhishingTemplateService.render_landing_page(
            email.campaign.template_name,
            token,
        )

        return HTMLResponse(content=html)
    
    
    
        # ==========================================
    # Scheduler Health
    # ==========================================

    @staticmethod
    async def scheduler_health(current_admin: CurrentAdmin):
        return success_response(
            message="Scheduler running.",
            data={
                "enabled": settings.PHISHING_SCHEDULER_ENABLED,
                "interval_seconds": settings.PHISHING_SCHEDULER_INTERVAL_SECONDS,
            },
        )

    # ==========================================
    # Department Heatmap
    # ==========================================

    @staticmethod
    async def department_heatmap(current_admin: CurrentAdmin):
        return success_response(
            message="Heatmap loaded.",
            data=await PhishingReportService.department_heatmap(),
        )

    # ==========================================
    # Weak Topics Analytics
    # ==========================================

    @staticmethod
    async def weak_topics(current_admin: CurrentAdmin):
        return success_response(
            message="Weak topics loaded.",
            data=await PhishingReportService.weak_topics(),
        )

    # ==========================================
    # Organization Reports
    # ==========================================

    @staticmethod
    async def organization_report(current_admin: CurrentAdmin):
        return success_response(
            message="Reports loaded.",
            data=await PhishingReportService.organization_summary(),
        )

    @staticmethod
    async def decide_email(
        token: str,
        payload: PhishingDecisionRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Phishing decision recorded.",
            data=await PhishingService.decide_email(
                token,
                payload.is_phishing,
                current_user,
            ),
        )

    @staticmethod
    async def start_simulation(current_user: CurrentUser):
        return success_response(
            message="Phishing simulation started.",
            data=await PhishingService.start_simulation(current_user),
        )

    @staticmethod
    async def simulation_summary(current_user: CurrentUser):
        return success_response(
            message="Simulation summary fetched.",
            data=await PhishingService.simulation_summary(current_user),
        )