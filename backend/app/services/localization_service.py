from app.services.translation_service import TranslationService


class LocalizationService:

    @staticmethod
    async def dashboard(data, language):

        return await TranslationService.translate_object(
            data,
            language,
        )

    @staticmethod
    async def notifications(data, language):

        return await TranslationService.translate_object(
            data,
            language,
        )

    @staticmethod
    async def lesson(data, language):

        return await TranslationService.translate_object(
            data,
            language,
        )

    @staticmethod
    async def quiz(data, language):

        return await TranslationService.translate_object(
            data,
            language,
        )

    @staticmethod
    async def chatbot(data, language):

        return await TranslationService.translate_object(
            data,
            language,
        )

    @staticmethod
    async def phishing_email(data, language):

        return await TranslationService.translate_object(
            data,
            language,
        )