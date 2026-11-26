from app.models.translation_cache import TranslationCache


class TranslationMemoryCache:

    _cache = {}

    @classmethod
    async def get(cls, text: str, language: str):

        key = f"{language}:{text}"

        if key in cls._cache:
            return cls._cache[key]

        cached = await TranslationCache.find_one(
            TranslationCache.language == language,
            TranslationCache.source_text == text,
        )

        if cached:
            cls._cache[key] = cached.translated_text
            return cached.translated_text

        return None

    @classmethod
    async def save(
        cls,
        text: str,
        translated: str,
        language: str,
    ):

        key = f"{language}:{text}"

        cls._cache[key] = translated

        await TranslationCache(
            source_text=text,
            translated_text=translated,
            language=language,
        ).insert()