from fastapi import APIRouter

from app.api.controllers.notification_controller import NotificationController

router = APIRouter(tags=["Notifications"])

router.get(
    "/notifications",
    summary="Get Notifications",
)(NotificationController.list_notifications)

router.get(
    "/notifications/unread-count",
    summary="Unread Notification Count",
)(NotificationController.unread_count)

router.patch(
    "/notifications/{notification_id}/read",
    summary="Mark Notification As Read",
)(NotificationController.mark_read)

router.patch(
    "/notifications/read-all",
    summary="Mark All Notifications As Read",
)(NotificationController.mark_all)