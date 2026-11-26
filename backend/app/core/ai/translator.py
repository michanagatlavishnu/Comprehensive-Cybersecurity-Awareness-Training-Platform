import json

from app.core.ai.groq_client import GroqClient


SUPPORTED_LANGUAGES = {
    "en": "English",
    "te": "Telugu",
    "hi": "Hindi",
}


class Translator:

    @staticmethod
    async def translate_text(text: str, language: str) -> str:

        if language == "en":
            return text

        if not text:
            return text

        return await GroqClient.translate(text, language)

    @staticmethod
    async def translate_json(data, language: str):

        if language == "en":
            return data

        prompt = f"""
Translate this JSON into {SUPPORTED_LANGUAGES[language]}.

Rules:
1. Preserve keys exactly.
2. Translate ONLY values.
3. Preserve HTML tags.
4. Preserve Markdown formatting.
5. Return ONLY valid JSON.

JSON:
{json.dumps(data, ensure_ascii=False)}
"""

        response = await GroqClient.json_chat(
            [
                {
                    "role": "system",
                    "content": "You translate JSON values only.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )

        return response