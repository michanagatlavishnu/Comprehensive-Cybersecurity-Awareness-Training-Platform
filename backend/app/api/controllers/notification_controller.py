from app.dependencies.auth import CurrentUser
from app.services.notification_service import NotificationService
from app.utils.response.api_response import success_response


class NotificationController:

    @staticmethod
    async def list_notifications(current_user: CurrentUser):
        notifications = await NotificationService.list_notifications(current_user)

        return success_response(
            message="Notifications fetched successfully.",
            data=notifications,
        )

    @staticmethod
    async def unread_count(current_user: CurrentUser):
        count = await NotificationService.unread_count(current_user)

        return success_response(
            message="Unread notification count fetched successfully.",
            data={"unread": count},
        )

    @staticmethod
    async def mark_read(
        notification_id: str,
        current_user: CurrentUser,
    ):
        notification = await NotificationService.mark_as_read(
            notification_id,
            current_user,
        )

        return success_response(
            message="Notification marked as read.",
            data=notification,
        )

    @staticmethod
    async def mark_all(current_user: CurrentUser):
        updated = await NotificationService.mark_all_as_read(current_user)

        return success_response(
            message="All notifications marked as read.",
            data={"updated": updated},
        )