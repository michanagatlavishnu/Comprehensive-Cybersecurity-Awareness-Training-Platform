from datetime import datetime
import secrets
from app.core.config import settings

from app.core.exceptions import NotFoundException
from app.models.user import User
from app.models.phishing_campaign import (
    PhishingCampaign,
    CampaignStatus,
)
from app.models.phishing_email import PhishingEmail
from app.models.phishing_event import (
    PhishingEvent,
    EventType,
)
from app.services.notification_service import NotificationService
from app.services.xp_manager import XPManager
from app.services.phishing_ai_generator import PhishingAIGenerator
from app.services.phishing_template_service import (
    PhishingTemplateService,
)
from app.services.localization_service import LocalizationService


class PhishingService:

    @staticmethod
    async def start_simulation(current_user: User):
        pending = await PhishingEmail.find({
            "user.$id": current_user.id,
            "delivered": True,
            "identified": False,
        }).to_list()
        if len(pending) >= 10:
            return {"created": 0, "message": "Your 10-message simulation is already active.", "active": True}

        existing = await PhishingEmail.find({"user.$id": current_user.id}).to_list()
        round_number = max((item.simulation_round for item in existing), default=0)
        if not pending:
            round_number += 1

        campaign = PhishingCampaign(
            title=f"Employee Phishing Simulation {round_number}",
            description="Interactive phishing identification practice.",
            department=current_user.department or "All",
            template_name="gmail",
            ai_prompt="Employee phishing identification practice",
            status=CampaignStatus.RUNNING,
        )
        await campaign.insert()

        messages = [
            {
                "subject": f"Urgent: Verify your account within 30 minutes [Round {round_number}]",
                "sender_name": "Microsoft Security",
                "sender_email": "security@micros0ft-verification.example",
                "is_phishing": True,
                "body": "Your account will be suspended. Verify your password immediately using the link below.",
            },
            {
                "subject": f"Your monthly security awareness newsletter [Round {round_number}]",
                "sender_name": "CyberAware Training",
                "sender_email": "training@cyberaware.example",
                "is_phishing": False,
                "body": "Your monthly security tips are ready in the CyberAware training portal.",
            },
            {
                "subject": f"Invoice overdue: payment required today [Round {round_number}]",
                "sender_name": "Accounts Payable",
                "sender_email": "billing@vendor-payment.example",
                "is_phishing": True,
                "body": "Open the attached invoice and confirm payment details before the account is closed.",
            },
            {
                "subject": f"Your password expires today [Round {round_number}]",
                "sender_name": "IT Help Desk",
                "sender_email": "helpdesk@cyberaware-login.example",
                "is_phishing": True,
                "body": "Use the attached sign-in form to keep your account active. Do not ignore this request.",
            },
            {
                "subject": f"Team meeting agenda - Friday [Round {round_number}]",
                "sender_name": "People Operations",
                "sender_email": "people@cyberaware.example",
                "is_phishing": False,
                "body": "The agenda for Friday's team meeting is available in the approved company workspace.",
            },
            {
                "subject": f"You've won an employee reward [Round {round_number}]",
                "sender_name": "Employee Rewards",
                "sender_email": "rewards@claim-prize.example",
                "is_phishing": True,
                "body": "Claim your reward now by confirming your company password and payroll details.",
            },
            {
                "subject": f"Scheduled security maintenance [Round {round_number}]",
                "sender_name": "CyberAware IT",
                "sender_email": "it@cyberaware.example",
                "is_phishing": False,
                "body": "Planned maintenance will take place Saturday from 10:00 to 11:00 UTC. No action is required.",
            },
            {
                "subject": f"Document shared with you [Round {round_number}]",
                "sender_name": "Cloud Documents",
                "sender_email": "share@cloud-docs-security.example",
                "is_phishing": True,
                "body": "A confidential document is waiting. Sign in immediately to avoid losing access.",
            },
            {
                "subject": f"Benefits enrollment reminder [Round {round_number}]",
                "sender_name": "Human Resources",
                "sender_email": "hr@cyberaware.example",
                "is_phishing": False,
                "body": "Benefits enrollment closes Friday. Visit the HR portal using your usual company bookmark.",
            },
            {
                "subject": f"Suspicious login detected [Round {round_number}]",
                "sender_name": "Account Protection",
                "sender_email": "alert@account-protection-reset.example",
                "is_phishing": True,
                "body": "We detected a suspicious login. Reply with your verification code to secure your account.",
            },
        ]
        messages = messages[: max(0, 10 - len(pending))]
        round_contexts = [
            "Account verification and suspicious-link awareness",
            "Invoices, shared documents, and payment pressure",
            "MFA codes, device alerts, and HR requests",
            "Cloud storage invitations and executive impersonation",
            "Travel notices, payroll changes, and QR-code scams",
        ]
        round_context = round_contexts[(round_number - 1) % len(round_contexts)]
        for item in messages:
            item["subject"] = f"{item['subject']} - {round_context}"
            item["body"] = f"{round_context}. {item['body']}"

        for item in messages:
            email = PhishingEmail(
                campaign=campaign,
                user=current_user,
                tracking_token=secrets.token_urlsafe(32),
                subject=item["subject"],
                sender_name=item["sender_name"],
                sender_email=item["sender_email"],
                html_body=f"<p>{item['body']}</p><p><strong>Review this message carefully before taking action.</strong></p>",
                delivered=True,
                is_phishing=item["is_phishing"],
                simulation_round=round_number,
            )
            await email.insert()

        await NotificationService.create_notification(
            user=current_user,
            title="New phishing simulation started",
            message="Your 10-message simulation is ready in the phishing inbox.",
            notification_type="info",
        )
        return {"created": len(messages), "message": "Simulation started.", "active": True}

    @staticmethod
    async def inbox(current_user: User):
        emails = await PhishingEmail.find(
            PhishingEmail.user.id == current_user.id,
            PhishingEmail.delivered == True,
        ).sort("-sent_at").to_list()

        return [
            {
                "id": str(email.id),
                "tracking_token": email.tracking_token,
                "subject": email.subject,
                "sender_name": email.sender_name,
                "sender_email": email.sender_email,
                "html_body": email.html_body,
                "opened": email.opened,
                "clicked": email.clicked,
                "reported": email.reported,
                "identified": email.identified,
                "identified_as_phishing": email.identified_as_phishing,
                "decision_correct": email.decision_correct,
                "sent_at": email.sent_at.isoformat(),
            }
            for email in emails
        ]

    @staticmethod
    async def simulation_summary(current_user: User):
        emails = await PhishingEmail.find({"user.$id": current_user.id}).to_list()
        rounds: dict[int, dict] = {}
        for email in emails:
            summary = rounds.setdefault(
                email.simulation_round,
                {"round": email.simulation_round, "total": 0, "identified": 0, "correct": 0},
            )
            summary["total"] += 1
            summary["identified"] += int(email.identified)
            summary["correct"] += int(bool(email.decision_correct))

        result = []
        for summary in sorted(rounds.values(), key=lambda item: item["round"]):
            summary["accuracy"] = round(
                summary["correct"] * 100 / summary["identified"], 1,
            ) if summary["identified"] else 0
            summary["completed"] = summary["total"] >= 10 and summary["identified"] == summary["total"]
            result.append(summary)
        return result

    @staticmethod
    async def decide_email(token: str, is_phishing: bool, current_user: User):
        email = await PhishingEmail.find_one({
            "tracking_token": token,
            "user.$id": current_user.id,
            "delivered": True,
        })
        if not email:
            raise NotFoundException("Email not found.")

        if email.identified:
            return await PhishingService.inbox_stats(current_user, email)

        email.identified = True
        email.identified_as_phishing = is_phishing
        email.decision_correct = is_phishing == email.is_phishing
        email.identified_at = datetime.utcnow()
        await email.save()

        if email.decision_correct:
            await XPManager.award_xp(current_user, 10)
            current_user.awareness_score = min(100, current_user.awareness_score + 2)
        else:
            current_user.awareness_score = max(0, current_user.awareness_score - 2)
        await current_user.save()

        await PhishingEvent(
            phishing_email=email,
            user=current_user,
            event_type=EventType.CLASSIFIED,
        ).insert()

        unlocked = []
        assigned = await PhishingEmail.find({
            "user.$id": current_user.id,
            "delivered": True,
        }).to_list()
        if assigned and all(item.identified and item.decision_correct for item in assigned):
            from app.services.user_service import UserService
            if await UserService.unlock_phishing_hunter_badge(current_user):
                unlocked.append("Phishing Hunter")

        result = await PhishingService.inbox_stats(current_user, email)
        result["badge_unlocked"] = unlocked
        return result

    @staticmethod
    async def inbox_stats(current_user: User, email: PhishingEmail):
        emails = await PhishingEmail.find({
            "user.$id": current_user.id,
            "delivered": True,
        }).to_list()
        identified = [item for item in emails if item.identified]
        correct = [item for item in identified if item.decision_correct]
        return {
            "email_id": str(email.id),
            "identified": email.identified,
            "is_phishing": email.identified_as_phishing,
            "correct": email.decision_correct,
            "identified_count": len(identified),
            "total_count": len(emails),
            "correct_count": len(correct),
            "awareness_score": current_user.awareness_score,
            "xp": current_user.xp.total_xp,
            "message": "Correct identification." if email.decision_correct else "That classification was incorrect.",
        }

    # ==========================================================
    # CREATE AI CAMPAIGN
    # ==========================================================

    @staticmethod
    async def create_campaign(payload):

        campaign = PhishingCampaign(
            title=payload.campaign_name,
            description=payload.topic,
            department=payload.department,
            language=payload.language,
            template_name=payload.template_name,
            ai_prompt=payload.topic,
            status=CampaignStatus.DRAFT,
        )

        await campaign.insert()

        return {
            "id": str(campaign.id),
            "title": campaign.title,
            "department": campaign.department,
            "status": campaign.status,
            "created_at": campaign.created_at.isoformat(),
        }

    # ==========================================================
    # GENERATE EMAIL PREVIEW (AI)
    # ==========================================================

    @staticmethod
    async def generate_email_preview(payload):

        generated = await PhishingAIGenerator.generate_email(
            department=payload.department,
            topic=payload.topic,
            template_name=payload.template_name,
            language=payload.language,
        )

        html = PhishingTemplateService.wrap_email(
            payload.template_name,
            generated["html_body"],
        )

        email = {
            "subject": generated["subject"],
            "sender_name": generated["sender_name"],
            "sender_email": generated["sender_email"],
            "html_body": html,
        }
        
        return await LocalizationService.phishing_email(
            email,
            payload.language,
        )

    # ==========================================================
    # LAUNCH CAMPAIGN
    # ==========================================================

    @staticmethod
    async def launch_campaign(payload):

        campaign = await PhishingCampaign.get(payload.campaign_id)

        if not campaign:
            raise NotFoundException("Campaign not found.")

        # ==========================================================
        # GET TARGET USERS
        # ==========================================================

        if campaign.department == "All":
            users = await User.find(
                User.is_active == True
            ).to_list()
        else:
            users = await User.find(
                User.department == campaign.department,
                User.is_active == True,
            ).to_list()

        # ==========================================================
        # GENERATE EMAIL CONTENT
        # ==========================================================

        email_content = await PhishingAIGenerator.generate_email(
            department=campaign.department,
            topic=campaign.ai_prompt,
            template_name=campaign.template_name,
            language=campaign.language,
        )

        sent = 0

        # ==========================================================
        # CREATE PHISHING EMAILS
        # ==========================================================

        for user in users:

            token = secrets.token_urlsafe(32)

            # ------------------------------------------------------
            # Tracking link
            # ------------------------------------------------------

            tracking_link = (
                f"{settings.PHISHING_BASE_URL}"
                f"/api/v1/phishing/click/{token}"
            )

            # ------------------------------------------------------
            # Load and render HTML template
            # ------------------------------------------------------

            html = PhishingTemplateService.render_template(
                campaign.template_name,
                tracking_link,
            )

            # ------------------------------------------------------
            # Add tracking pixel
            # ------------------------------------------------------

            html += PhishingTemplateService.tracking_pixel(
                token
            )

            # ------------------------------------------------------
            # Create phishing email record
            # ------------------------------------------------------

            phishing_email = PhishingEmail(
                campaign=campaign,
                user=user,
                tracking_token=token,
                subject=email_content["subject"],
                sender_name=email_content["sender_name"],
                sender_email=email_content["sender_email"],
                html_body=html,
                language=campaign.language,
                delivered=True,
            )

            await phishing_email.insert()

            # ------------------------------------------------------
            # Create notification
            # ------------------------------------------------------

            await NotificationService.create_notification(
                user=user,
                title="📧 New Security Email",
                message=(
                    "A new email has arrived in your "
                    "CyberAware inbox."
                ),
                notification_type="info",
            )

            sent += 1

        # ==========================================================
        # UPDATE CAMPAIGN
        # ==========================================================

        campaign.total_targets = len(users)
        campaign.total_sent = sent
        campaign.status = CampaignStatus.RUNNING
        campaign.updated_at = datetime.utcnow()

        await campaign.save()

        # ==========================================================
        # RESPONSE
        # ==========================================================

        return {
            "campaign_id": str(campaign.id),
            "campaign": campaign.title,
            "department": campaign.department,
            "language": campaign.language,
            "sent": sent,
            "status": campaign.status,
        }


    # ==========================================================
    # EMAIL OPEN TRACKING
    # ==========================================================

    @staticmethod
    async def open_email(token: str):

        email = await PhishingEmail.find_one(
            PhishingEmail.tracking_token == token
        )

        if not email:
            raise NotFoundException("Email not found.")

        await email.fetch_link(PhishingEmail.user)

        if email.opened:
            return {
                "opened": True,
                "message": "Already opened.",
            }

        email.opened = True
        email.opened_at = datetime.utcnow()

        await email.save()

        await PhishingEvent(
            phishing_email=email,
            user=email.user,
            event_type=EventType.OPENED,
        ).insert()

        return {
            "opened": True,
            "opened_at": email.opened_at.isoformat(),
        }

    # ==========================================================
    # CLICK PHISHING LINK
    # ==========================================================

    @staticmethod
    async def click_email(token: str):

        email = await PhishingEmail.find_one(
            PhishingEmail.tracking_token == token
        )

        if not email:
            raise NotFoundException("Invalid phishing email.")

        await email.fetch_link(PhishingEmail.user)
        await email.fetch_link(PhishingEmail.campaign)

        if email.clicked:
            return {
                "clicked": True,
                "message": "Already clicked.",
            }

        email.clicked = True
        email.clicked_at = datetime.utcnow()

        await email.save()

        user = email.user

        # XP Penalty
        user.xp.total_xp = max(
            0,
            user.xp.total_xp - 30,
        )

        # Awareness Penalty
        user.awareness_score = max(
            0,
            user.awareness_score - 5,
        )

        await user.save()

        await PhishingEvent(
            phishing_email=email,
            user=user,
            event_type=EventType.CLICKED,
        ).insert()

        from app.services.retraining_service import RetrainingService

        await RetrainingService.assign_phishing_retraining(user)

        await NotificationService.create_notification(
            user=user,
            title="⚠️ Phishing Link Clicked",
            message="You clicked a simulated phishing email. Mandatory retraining assigned.",
            notification_type="warning",
        )

        return {
            "clicked": True,
            "xp_penalty": 30,
            "awareness_penalty": 5,
            "lesson_retake": True,
            "clicked_at": email.clicked_at.isoformat(),
        }

    # ==========================================================
    # SUBMIT FAKE CREDENTIALS
    # ==========================================================

    @staticmethod
    async def submit_credentials(payload):

        email = await PhishingEmail.find_one(
            PhishingEmail.tracking_token == payload.tracking_token
        )

        if not email:
            raise NotFoundException("Invalid phishing email.")

        await email.fetch_link(PhishingEmail.user)

        if email.credentials_submitted:
            return {
                "submitted": True,
                "message": "Credentials already submitted.",
            }

        email.credentials_submitted = True
        email.credentials_at = datetime.utcnow()

        await email.save()

        user = email.user

        # Bigger Penalty
        user.xp.total_xp = max(
            0,
            user.xp.total_xp - 50,
        )

        user.awareness_score = max(
            0,
            user.awareness_score - 10,
        )

        await user.save()

        await PhishingEvent(
            phishing_email=email,
            user=user,
            event_type=EventType.CLICKED,
        ).insert()

        from app.services.retraining_service import RetrainingService

        await RetrainingService.assign_phishing_retraining(user)

        await NotificationService.create_notification(
            user=user,
            title="🚨 Credentials Submitted",
            message="You submitted credentials on a phishing page. Mandatory retraining assigned.",
            notification_type="danger",
        )

        return {
            "submitted": True,
            "xp_penalty": 50,
            "awareness_penalty": 10,
            "lesson_retake": True,
            "submitted_at": email.credentials_at.isoformat(),
        }

    # ==========================================================
    # REPORT PHISHING EMAIL
    # ==========================================================

    @staticmethod
    async def report_email(token: str, current_user: User):

        email = await PhishingEmail.find_one(
            {
                "tracking_token": token,
                "user.$id": current_user.id,
                "delivered": True,
            }
        )

        if not email:
            raise NotFoundException("Email not found.")

        await email.fetch_link(PhishingEmail.user)

        if email.reported:
            return {
                "reported": True,
                "message": "Already reported.",
            }

        email.reported = True
        email.reported_at = datetime.utcnow()

        await email.save()

        user = email.user

        # Reward XP
        await XPManager.award_xp(user, 50)

        # Increase Awareness
        user.awareness_score = min(
            100,
            user.awareness_score + 5,
        )

        await user.save()

        await PhishingEvent(
            phishing_email=email,
            user=user,
            event_type=EventType.REPORTED,
        ).insert()

        await NotificationService.create_notification(
            user=user,
            title="🛡️ Great Job!",
            message="You successfully reported a phishing email. +50 XP awarded.",
            notification_type="success",
        )

        return {
            "reported": True,
            "xp_reward": 50,
            "awareness_reward": 5,
            "reported_at": email.reported_at.isoformat(),
        }

    # ==========================================================
    # ADMIN CAMPAIGN ANALYTICS
    # ==========================================================

    @staticmethod
    async def analytics():

        campaigns = (
            await PhishingCampaign.find_all()
            .sort("-created_at")
            .to_list()
        )

        analytics = []

        for campaign in campaigns:

            emails = await PhishingEmail.find(
                PhishingEmail.campaign.id == campaign.id
            ).to_list()

            total = len(emails)

            opened = len([e for e in emails if e.opened])
            clicked = len([e for e in emails if e.clicked])
            reported = len([e for e in emails if e.reported])
            credentials = len(
                [e for e in emails if e.credentials_submitted]
            )
            identified = len([e for e in emails if e.identified])
            correct = len([e for e in emails if e.decision_correct])
            employee_reports = []
            employees = {}
            for email in emails:
                await email.fetch_link(PhishingEmail.user)
                employee = email.user
                employee_key = str(employee.id)
                report = employees.setdefault(
                    employee_key,
                    {
                        "employee_id": employee_key,
                        "employee_name": employee.full_name,
                        "employee_email": employee.email,
                        "identified": 0,
                        "correct": 0,
                        "reported": 0,
                        "clicked": 0,
                        "credentials_submitted": 0,
                    },
                )
                report["identified"] += int(email.identified)
                report["correct"] += int(bool(email.decision_correct))
                report["reported"] += int(email.reported)
                report["clicked"] += int(email.clicked)
                report["credentials_submitted"] += int(email.credentials_submitted)
            for report in employees.values():
                report["accuracy"] = round(
                    report["correct"] / report["identified"] * 100,
                    2,
                ) if report["identified"] else 0
                employee_reports.append(report)
            risk_score = round(
                ((clicked * 2 + credentials * 4 + max(0, total - reported)) / (total * 4)) * 100,
                2,
            ) if total else 0

            analytics.append(
                {
                    "campaign_id": str(campaign.id),
                    "campaign": campaign.title,
                    "department": campaign.department,
                    "language": campaign.language,
                    "status": campaign.status,
                    "targets": total,
                    "opened": opened,
                    "clicked": clicked,
                    "reported": reported,
                    "credentials_submitted": credentials,
                    "open_rate": round(
                        (opened / total) * 100,
                        2,
                    ) if total else 0,
                    "click_rate": round(
                        (clicked / total) * 100,
                        2,
                    ) if total else 0,
                    "report_rate": round(
                        (reported / total) * 100,
                        2,
                    ) if total else 0,
                    "credential_rate": round(
                        (credentials / total) * 100,
                        2,
                    ) if total else 0,
                    "identified": identified,
                    "correct_identifications": correct,
                    "employee_reports": employee_reports,
                    "identification_rate": round((identified / total) * 100, 2) if total else 0,
                    "risk_score": min(100, risk_score),
                    "risk_level": "High" if risk_score >= 60 else "Medium" if risk_score >= 30 else "Low",
                    "created_at": campaign.created_at.isoformat(),
                }
            )

        return analytics

    # ==========================================================
    # EMPLOYEE PHISHING HISTORY
    # ==========================================================

    @staticmethod
    async def employee_history(current_user: User):

        emails = (
            await PhishingEmail.find(
                PhishingEmail.user.id == current_user.id
            )
            .sort("-sent_at")
            .to_list()
        )

        history = [
            {
                "campaign": str(email.campaign.id),
                "subject": email.subject,
                "opened": email.opened,
                "clicked": email.clicked,
                "reported": email.reported,
                "credentials_submitted": email.credentials_submitted,
                "language": email.language,
                "sent_at": email.sent_at.isoformat(),
            }
            for email in emails
        ]
        
        return await LocalizationService.phishing_email(
            history,
            current_user.language,
        )