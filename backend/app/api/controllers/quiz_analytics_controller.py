from app.dependencies.auth import CurrentAdmin, CurrentUser
from app.services.quiz_analytics_service import QuizAnalyticsService
from app.utils.response.api_response import success_response


class QuizAnalyticsController:

    # =====================================================
    # ADMIN ANALYTICS
    # =====================================================

    @staticmethod
    async def overview(current_admin: CurrentAdmin):
        return success_response(
            message="Quiz overview fetched successfully.",
            data=await QuizAnalyticsService.overview(),
        )

    @staticmethod
    async def pass_rate(current_admin: CurrentAdmin):
        return success_response(
            message="Quiz pass rate fetched successfully.",
            data=await QuizAnalyticsService.pass_rate(),
        )

    @staticmethod
    async def department_performance(current_admin: CurrentAdmin):
        return success_response(
            message="Department quiz performance fetched successfully.",
            data=await QuizAnalyticsService.department_performance(),
        )

    @staticmethod
    async def average_scores(current_admin: CurrentAdmin):
        return success_response(
            message="Average quiz scores fetched successfully.",
            data=await QuizAnalyticsService.average_scores(),
        )

    @staticmethod
    async def top_performers(current_admin: CurrentAdmin):
        return success_response(
            message="Top performers fetched successfully.",
            data=await QuizAnalyticsService.top_performers(),
        )

    @staticmethod
    async def weak_topics(current_admin: CurrentAdmin):
        return success_response(
            message="Weak topic analytics fetched successfully.",
            data=await QuizAnalyticsService.weak_topics(),
        )

    @staticmethod
    async def difficulty_breakdown(current_admin: CurrentAdmin):
        return success_response(
            message="Quiz difficulty breakdown fetched successfully.",
            data=await QuizAnalyticsService.difficulty_breakdown(),
        )

    @staticmethod
    async def popular_quizzes(current_admin: CurrentAdmin):
        return success_response(
            message="Popular quizzes fetched successfully.",
            data=await QuizAnalyticsService.popular_quizzes(),
        )

    @staticmethod
    async def weekly_history(current_admin: CurrentAdmin):
        return success_response(
            message="Weekly quiz analytics fetched successfully.",
            data=await QuizAnalyticsService.history(),
        )

    # =====================================================
    # EMPLOYEE ANALYTICS
    # =====================================================

    @staticmethod
    async def my_performance(current_user: CurrentUser):
        return success_response(
            message="My quiz performance fetched successfully.",
            data=await QuizAnalyticsService.employee_performance(current_user),
        )

    @staticmethod
    async def my_history(current_user: CurrentUser):
        return success_response(
            message="My quiz history fetched successfully.",
            data=await QuizAnalyticsService.employee_history(current_user),
        )

    @staticmethod
    async def my_topics(current_user: CurrentUser):
        return success_response(
            message="My topic scores fetched successfully.",
            data=await QuizAnalyticsService.employee_topic_scores(current_user),
        )

    @staticmethod
    async def ai_recommendations(current_user: CurrentUser):
        return success_response(
            message="AI learning recommendations fetched successfully.",
            data=await QuizAnalyticsService.ai_recommendations(current_user),
        )