from fastapi import APIRouter

from app.api.controllers.module_controller import ModuleController
from app.api.controllers.lesson_controller import LessonController 
router = APIRouter(tags=["Learning Modules"])

# ==========================================
# EMPLOYEE MODULE APIs
# ==========================================

router.get(
    "/modules",
    summary="Get Learning Modules",
)(ModuleController.list_modules)

router.get(
    "/modules/{module_id}",
    summary="Get Module Details",
)(ModuleController.module_details)

# ==========================================
# ADMIN MODULE APIs
# ==========================================

router.post(
    "/admin/modules",
    summary="Create Learning Module",
)(ModuleController.create_module)

router.put(
    "/admin/modules/{module_id}",
    summary="Update Learning Module",
)(ModuleController.update_module)

router.delete(
    "/admin/modules/{module_id}",
    summary="Delete Learning Module",
)(ModuleController.delete_module)


router.get(
    "/modules/{module_id}/lessons",
    summary="Get Module Lessons",
)(LessonController.employee_lessons)

router.get(
    "/lessons/{lesson_id}",
    summary="Get Lesson Details",
)(LessonController.employee_lesson)

router.post(
    "/lessons/{lesson_id}/progress",
    summary="Update Lesson Progress",
)(LessonController.update_progress)

router.post(
    "/lessons/{lesson_id}/complete",
    summary="Complete Lesson",
)(LessonController.complete_lesson)