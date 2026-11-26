from app.core.config import settings
from app.core.exceptions import BadRequestException
from app.dependencies.auth import CurrentUser
from app.schemas.language import UpdateLanguageRequest
from app.services.language_service import LanguageService
from app.utils.response.api_response import success_response


class LanguageController:

    @staticmethod
    async def get_language(current_user: CurrentUser):
        return success_response(
            message="Language fetched successfully.",
            data=await LanguageService.get_language(current_user),
        )

    @staticmethod
    async def update_language(
        payload: UpdateLanguageRequest,
        current_user: CurrentUser,
    ):
        if payload.language not in settings.SUPPORTED_LANGUAGES:
            raise BadRequestException("Unsupported language.")

        return success_response(
            message="Language updated successfully.",
            data=await LanguageService.update_language(
                current_user,
                payload.language,
            ),
        )