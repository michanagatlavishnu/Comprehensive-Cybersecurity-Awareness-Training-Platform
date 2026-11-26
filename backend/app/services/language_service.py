from app.models.user import User


class LanguageService:

    @staticmethod
    async def update_language(
        current_user: User,
        language: str,
    ):

        current_user.language = language

        await current_user.save()

        return {
            "language": language,
        }

    @staticmethod
    async def get_language(current_user: User):

        return {
            "language": current_user.language,
            "supported_languages": [
                "en",
                "te",
                "hi",
            ],
        }