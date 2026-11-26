from fastapi import APIRouter

from app.api.controllers.lesson_controller import LessonController

router = APIRouter(tags=["Lessons"])

# ==========================================
# ADMIN LESSON APIs
# ==========================================

router.post(
    "/admin/modules/{module_id}/lessons",
    summary="Create Lesson",
)(LessonController.create_lesson)

router.get(
    "/admin/modules/{module_id}/lessons",
    summary="List Module Lessons (Admin)",
)(LessonController.list_module_lessons)

router.get(
    "/admin/lessons/{lesson_id}",
    summary="Get Lesson (Admin)",
)(LessonController.get_lesson)

router.put(
    "/admin/lessons/{lesson_id}",
    summary="Update Lesson",
)(LessonController.update_lesson)

router.delete(
    "/admin/lessons/{lesson_id}",
    summary="Delete Lesson",
)(LessonController.delete_lesson)

router.patch(
    "/admin/lessons/{lesson_id}/publish",
    summary="Publish / Unpublish Lesson",
)(LessonController.publish_lesson)

router.post(
    "/admin/lessons/{lesson_id}/youtube-sync",
    summary="Sync YouTube Video Metadata",
)(LessonController.sync_youtube_video)

router.patch(
    "/admin/lessons/reorder",
    summary="Reorder Lessons",
)(LessonController.reorder_lessons)

# ==========================================
# EMPLOYEE LESSON APIs
# ==========================================

router.get(
    "/modules/{module_id}/lessons",
    summary="Employee Module Lessons",
)(LessonController.employee_lessons)

router.get(
    "/lessons/{lesson_id}",
    summary="Employee Lesson Details",
)(LessonController.employee_lesson)

router.get(
    "/lessons/{lesson_id}/ai-notes",
    summary="Generate AI Lesson Notes",
)(LessonController.ai_notes)


# ==========================================
# LESSON COMPLETION
# ==========================================

router.post(
    "/lessons/{lesson_id}/complete",
    summary="Complete Lesson",
)(LessonController.complete_lesson)

router.post(
    "/lessons/{lesson_id}/progress",
    summary="Update Lesson Video Progress",
)(LessonController.update_progress)

router.get(
    "/modules/{module_id}/progress",
    summary="Module Progress",
)(LessonController.module_progress)

router.get(
    "/users/me/completed-lessons",
    summary="Completed Lessons",
)(LessonController.completed_lessons)
router.get(
    "/lessons/{lesson_id}/details",
    summary="Lesson Details",
)(LessonController.employee_lesson)