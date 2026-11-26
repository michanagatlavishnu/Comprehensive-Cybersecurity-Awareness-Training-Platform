from app.core.ai.translation_cache import TranslationMemoryCache
from app.core.ai.translator import Translator


class TranslationService:

    @staticmethod
    async def translate(text: str, language: str):

        cached = await TranslationMemoryCache.get(
            text,
            language,
        )

        if cached:
            return cached

        translated = await Translator.translate_text(
            text,
            language,
        )

        await TranslationMemoryCache.save(
            text,
            translated,
            language,
        )

        return translated

    @staticmethod
    async def translate_object(obj, language: str):

        if language == "en":
            return obj

        if isinstance(obj, str):
            return await TranslationService.translate(
                obj,
                language,
            )

        if isinstance(obj, list):

            result = []

            for item in obj:
                result.append(
                    await TranslationService.translate_object(
                        item,
                        language,
                    )
                )

            return result

        if isinstance(obj, dict):

            translated = {}

            for key, value in obj.items():
                translated[key] = (
                    await TranslationService.translate_object(
                        value,
                        language,
                    )
                )

            return translated

        return obj