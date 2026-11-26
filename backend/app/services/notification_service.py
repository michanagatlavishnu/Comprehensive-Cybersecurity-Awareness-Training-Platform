from beanie import PydanticObjectId
from pydantic_core import PydanticCustomError

from app.core.exceptions import NotFoundException
from app.models.notification import Notification
from app.models.user import User
from app.services.localization_service import LocalizationService


class NotificationService:

    # ==========================================
    # LIST NOTIFICATIONS
    # ==========================================

    @staticmethod
    async def list_notifications(current_user: User):

        notifications = (
            await Notification.find(
                Notification.user.id == current_user.id
            )
            .sort("-created_at")
            .to_list()
        )

        serialized_notifications = [
            {
                "id": str(notification.id),
                "title": notification.title,
                "message": notification.message,
                "type": notification.type,
                "is_read": notification.is_read,
                "created_at": notification.created_at.isoformat(),
            }
            for notification in notifications
        ]

        return await LocalizationService.notifications(
            serialized_notifications,
            current_user.language,
        )

    # ==========================================
    # UNREAD COUNT
    # ==========================================

    @staticmethod
    async def unread_count(current_user: User):

        unread = await Notification.find(
            Notification.user.id == current_user.id,
            Notification.is_read == False,
        ).count()

        return unread

    # ==========================================
    # MARK ONE READ
    # ==========================================

    @staticmethod
    async def mark_as_read(
        notification_id: str,
        current_user: User,
    ):
        try:
            object_id = PydanticObjectId(notification_id)
        except (ValueError, PydanticCustomError):
            raise NotFoundException("Notification not found.")

        notification = await Notification.find_one(
            Notification.id == object_id,
            Notification.user.id == current_user.id,
        )

        if not notification:
            raise NotFoundException("Notification not found.")

        notification.is_read = True
        await notification.save()

        return {
            "id": str(notification.id),
            "is_read": True,
        }

    # ==========================================
    # MARK ALL READ
    # ==========================================

    @staticmethod
    async def mark_all_as_read(current_user: User):

        result = await Notification.find(
            Notification.user.id == current_user.id,
            Notification.is_read == False,
        ).update_many({"$set": {"is_read": True}})

        return result.modified_count

    # ==========================================
    # CREATE NOTIFICATION
    # ==========================================

    @staticmethod
    async def create_notification(
        user: User,
        title: str,
        message: str,
        notification_type: str = "info",
    ):

        notification = Notification(
            user=user,
            title=title,
            message=message,
            type=notification_type,
            is_read=False,
        )

        await notification.insert()

        return notification