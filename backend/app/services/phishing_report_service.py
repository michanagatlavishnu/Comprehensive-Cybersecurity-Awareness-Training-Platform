from statistics import mean

from app.models.phishing_campaign import PhishingCampaign
from app.models.phishing_email import PhishingEmail
from app.models.phishing_event import EventType


class PhishingReportService:

    @staticmethod
    async def campaign_report(campaign_id: str):

        campaign = await PhishingCampaign.get(campaign_id)

        emails = await PhishingEmail.find(
            PhishingEmail.campaign.id == campaign.id
        ).to_list()

        total = len(emails)

        opened = sum(email.opened for email in emails)

        clicked = sum(email.clicked for email in emails)

        reported = sum(email.reported for email in emails)

        credentials = sum(
            email.credentials_submitted for email in emails
        )

        return {
            "campaign": campaign.title,
            "targets": total,
            "opened": opened,
            "clicked": clicked,
            "reported": reported,
            "credentials": credentials,
            "open_rate": round(opened * 100 / total, 2) if total else 0,
            "click_rate": round(clicked * 100 / total, 2) if total else 0,
            "report_rate": round(reported * 100 / total, 2) if total else 0,
            "credential_rate": round(credentials * 100 / total, 2) if total else 0,
        }

    @staticmethod
    async def organization_summary():

        campaigns = await PhishingCampaign.find_all().to_list()

        reports = []

        for campaign in campaigns:
            reports.append(
                await PhishingReportService.campaign_report(
                    str(campaign.id)
                )
            )

        return reports
    
    
    
    
    @staticmethod
    async def employee_risk_score(user):

        emails = await PhishingEmail.find(
            PhishingEmail.user.id == user.id
        ).to_list()

        risk = 0

        for email in emails:

            if email.clicked:
                risk += 20

            if email.credentials_submitted:
                risk += 40

            if email.reported:
                risk -= 10

        risk = max(0, min(risk, 100))

        return {
            "risk_score": risk,
            "risk_level": (
                "Low"
                if risk < 30
                else "Medium"
                if risk < 60
                else "High"
            ),
        }
        
        
    @staticmethod
    async def department_heatmap():

        campaigns = await PhishingCampaign.find_all().to_list()

        heatmap = {}

        for campaign in campaigns:

            emails = await PhishingEmail.find(
                PhishingEmail.campaign.id == campaign.id
            ).to_list()

            total = len(emails)

            clicked = sum(email.clicked for email in emails)

            score = round(clicked * 100 / total, 2) if total else 0

            department = campaign.department

            heatmap.setdefault(department, []).append(score)

        return [
            {
                "department": department,
                "average_click_rate": round(mean(scores), 2),
            }
            for department, scores in heatmap.items()
        ]
        
    @staticmethod
    async def weak_topics():

        campaigns = await PhishingCampaign.find_all().to_list()

        result = []

        for campaign in campaigns:

            emails = await PhishingEmail.find(
                PhishingEmail.campaign.id == campaign.id
            ).to_list()

            total = len(emails)

            clicked = sum(email.clicked for email in emails)

            if total == 0:
                continue

            result.append(
                {
                    "topic": campaign.title,
                    "department": campaign.department,
                    "click_rate": round(clicked * 100 / total, 2),
                }
            )

        result.sort(
            key=lambda topic: topic["click_rate"],
            reverse=True,
        )

        return result[:5]
    

    
    