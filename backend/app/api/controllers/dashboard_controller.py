from app.dependencies.auth import CurrentAdmin, CurrentUser
from app.services.dashboard_service import DashboardService
from app.utils.response.api_response import success_response
from app.models.learning_activity import LearningActivity
from app.schemas.dashboard import LearningActivityRequest


class DashboardController:

    # ==========================================
    # EMPLOYEE DASHBOARD
    # ==========================================

    @staticmethod
    async def employee_dashboard(current_user: CurrentUser):
        dashboard = await DashboardService.employee_dashboard(current_user)

        return success_response(
            message="Dashboard fetched successfully.",
            data=dashboard,
        )

    @staticmethod
    async def weekly_activity(current_user: CurrentUser):
        activity = await DashboardService.weekly_activity(current_user)

        return success_response(
            message="Weekly activity fetched successfully.",
            data=activity,
        )

    @staticmethod
    async def learning_progress(current_user: CurrentUser):
        progress = await DashboardService.learning_progress(current_user)

        return success_response(
            message="Learning progress fetched successfully.",
            data=progress,
        )

    @staticmethod
    async def xp_history(current_user: CurrentUser):
        history = await DashboardService.xp_history(current_user)

        return success_response(
            message="XP history fetched successfully.",
            data=history,
        )

    # ==========================================
    # ADMIN DASHBOARD
    # ==========================================

    @staticmethod
    async def admin_dashboard(current_admin: CurrentAdmin):
        dashboard = await DashboardService.admin_dashboard()

        return success_response(
            message="Admin dashboard fetched successfully.",
            data=dashboard,
        )

    @staticmethod
    async def awareness_distribution(current_admin: CurrentAdmin):
        return success_response(
            message="Awareness distribution fetched successfully.",
            data=await DashboardService.awareness_distribution(),
        )

    @staticmethod
    async def department_analytics(current_admin: CurrentAdmin):
        return success_response(
            message="Department analytics fetched successfully.",
            data=await DashboardService.department_analytics(),
        )

    @staticmethod
    async def security_metrics(current_admin: CurrentAdmin):
        return success_response(
            message="Security metrics fetched successfully.",
            data=await DashboardService.security_metrics(),
        )

    @staticmethod
    async def weekly_trend(current_admin: CurrentAdmin):
        return success_response(
            message="Weekly trend fetched successfully.",
            data=await DashboardService.weekly_trend(),
        )

    @staticmethod
    async def record_activity(
        payload: LearningActivityRequest,
        current_user: CurrentUser,
    ):
        activity = LearningActivity(
            user=current_user,
            activity_type=payload.activity_type,
            course_title=payload.course_title,
            lesson_title=payload.lesson_title,
        )
        await activity.insert()
        return success_response(
            message="Learning activity recorded successfully.",
            data={"id": str(activity.id)},
        )