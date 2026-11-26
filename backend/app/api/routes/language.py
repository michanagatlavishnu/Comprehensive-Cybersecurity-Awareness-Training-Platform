from fastapi import APIRouter

from app.api.controllers.language_controller import LanguageController

router = APIRouter(tags=["Language"])

router.get(
    "/language",
    summary="Get Current Language",
)(LanguageController.get_language)

router.put(
    "/language",
    summary="Update User Language",
)(LanguageController.update_language)