from typing import Annotated

from fastapi import Depends

from app.middleware.auth import get_current_user
from app.middleware.role import require_admin
from app.models.user import User
from app.schemas.lesson import (
    LessonCreateRequest,
    LessonReorderRequest,
    LessonUpdateRequest,
    PublishLessonRequest,
    LessonProgressRequest,
    YouTubeSyncRequest,
)
from app.services.lesson_service import LessonService
from app.services.youtube_service import YouTubeService
from app.utils.response.api_response import success_response

CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentAdmin = Annotated[User, Depends(require_admin())]

from app.models.module import LearningModule
class LessonController:

    # ===========================
    # ADMIN
    # ===========================

    @staticmethod
    async def create_lesson(
        module_id: str,
        payload: LessonCreateRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Lesson created successfully.",
            data=await LessonService.create_lesson(module_id, payload),
        )

    @staticmethod
    async def list_module_lessons(
        module_id: str,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Lessons fetched successfully.",
            data=await LessonService.list_lessons(module_id, admin=True),
        )

    @staticmethod
    async def get_lesson(
        lesson_id: str,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Lesson fetched successfully.",
            data=await LessonService.get_lesson(lesson_id),
        )

    @staticmethod
    async def update_lesson(
        lesson_id: str,
        payload: LessonUpdateRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Lesson updated successfully.",
            data=await LessonService.update_lesson(lesson_id, payload),
        )

    @staticmethod
    async def delete_lesson(
        lesson_id: str,
        current_admin: CurrentAdmin,
    ):
        await LessonService.delete_lesson(lesson_id)

        return success_response(
            message="Lesson deleted successfully.",
        )

    @staticmethod
    async def publish_lesson(
        lesson_id: str,
        payload: PublishLessonRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Lesson publish status updated.",
            data=await LessonService.publish_lesson(
                lesson_id,
                payload.is_published,
            ),
        )

    @staticmethod
    async def reorder_lessons(
        payload: LessonReorderRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Lesson order updated successfully.",
            data=await LessonService.reorder_lessons(payload),
        )

    # ===========================
    # EMPLOYEE
    # ===========================

    @staticmethod
    async def employee_lessons(
        module_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Lessons fetched successfully.",
            data=await LessonService.employee_lessons(module_id, current_user),
        )

    @staticmethod
    async def employee_lesson(
        lesson_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Lesson fetched successfully.",
            data=await LessonService.employee_lesson(
                lesson_id,
                current_user,
            ),
        )

    @staticmethod
    async def ai_notes(
        lesson_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="AI lesson notes generated successfully.",
            data=await LessonService.ai_notes(lesson_id, current_user),
        )

    # ===========================
    # LESSON COMPLETION
    # ===========================

    @staticmethod
    async def complete_lesson(
        lesson_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Lesson completed successfully.",
            data=await LessonService.complete_lesson(
                lesson_id,
                current_user,
            ),
        )

    @staticmethod
    async def update_progress(
        lesson_id: str,
        payload: LessonProgressRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Lesson progress saved successfully.",
            data=await LessonService.update_progress(
                lesson_id,
                current_user,
                payload.progress_percent,
                payload.watch_time_seconds,
            ),
        )

    @staticmethod
    async def sync_youtube_video(
        lesson_id: str,
        payload: YouTubeSyncRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="YouTube video synced successfully.",
            data=await YouTubeService.sync_lesson_video(lesson_id, payload.url),
        )

    @staticmethod
    async def module_progress(
        module_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Module progress fetched successfully.",
            data=await LessonService.module_progress(
                module_id,
                current_user,
            ),
        )

    @staticmethod
    async def completed_lessons(
        current_user: CurrentUser,
    ):
        return success_response(
            message="Completed lessons fetched successfully.",
            data=await LessonService.completed_lessons(
                current_user,
            ),
        )
        
        
        
    