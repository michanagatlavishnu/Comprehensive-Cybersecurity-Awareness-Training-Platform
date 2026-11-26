from datetime import datetime

from app.models.phishing_campaign import (
    PhishingCampaign,
    CampaignStatus,
)
from app.schemas.phishing import LaunchCampaignRequest
from app.services.phishing_service import PhishingService


class PhishingSchedulerService:

    @staticmethod
    async def run_scheduler():

        campaigns = await PhishingCampaign.find(
            PhishingCampaign.status == CampaignStatus.SCHEDULED
        ).to_list()

        now = datetime.utcnow()

        launched = 0

        for campaign in campaigns:

            if campaign.scheduled_at and campaign.scheduled_at <= now:

                await PhishingService.launch_campaign(
                    LaunchCampaignRequest(
                        campaign_id=str(campaign.id)
                    )
                )

                campaign.status = CampaignStatus.RUNNING
                campaign.launched_at = now
                campaign.updated_at = now

                await campaign.save()

                launched += 1

        return {"launched": launched}

    @staticmethod
    async def schedule_campaign(campaign_id: str, scheduled_at: datetime):

        campaign = await PhishingCampaign.get(campaign_id)

        if not campaign:
            raise Exception("Campaign not found.")

        campaign.status = CampaignStatus.SCHEDULED
        campaign.scheduled_at = scheduled_at
        campaign.updated_at = datetime.utcnow()

        await campaign.save()

        return {
            "campaign_id": str(campaign.id),
            "scheduled_at": scheduled_at.isoformat(),
            "status": campaign.status,
        }