import json

from groq import AsyncGroq

from app.core.config import settings


client = AsyncGroq(
    api_key=settings.GROQ_API_KEY,
)


class GroqClient:

    # ======================================================
    # NORMAL CHAT
    # ======================================================

    @staticmethod
    async def chat(messages):

        completion = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=settings.AI_RESPONSE_TEMPERATURE,
        )

        return completion.choices[0].message.content

    # ======================================================
    # JSON CHAT
    # ======================================================

    @staticmethod
    async def json_chat(messages):

        completion = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.2,
            response_format={"type": "json_object"},
        )

        return json.loads(completion.choices[0].message.content)

    # ======================================================
    # TRANSLATION
    # ======================================================

    @staticmethod
    async def translate(text: str, language: str):

        completion = await client.chat.completions.create(
            model=settings.GROQ_TRANSLATION_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Translate into {language}. "
                        "Keep formatting exactly the same."
                    ),
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
            temperature=0,
        )

        return completion.choices[0].message.content