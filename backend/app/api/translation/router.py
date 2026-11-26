import re
from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.config import settings

router = APIRouter(prefix="/translation", tags=["translation"])
cache: dict[tuple[str, str], str] = {}


class TranslationRequest(BaseModel):
    language: Literal["hi", "te"]
    text: str = Field(min_length=1, max_length=4000)


@router.post("/translate")
async def translate(request: TranslationRequest) -> dict[str, str]:
    key = (request.language, request.text)
    if key in cache:
        return {"translation": cache[key]}

    api_key = settings.GROQ_API_KEY
    if not api_key:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY is not configured")

    language_name = "Hindi" if request.language == "hi" else "Telugu"
    payload = {
        "model": settings.GROQ_TRANSLATION_MODEL,
        "temperature": 0,
        "messages": [
            {
                "role": "system",
                "content": f"Translate the supplied UI text to {language_name}. Preserve meaning, numbers, punctuation, and placeholders. Return only the translation.",
            },
            {"role": "user", "content": request.text},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json=payload,
            )
            response.raise_for_status()
            translated = response.json()["choices"][0]["message"]["content"].strip()
            translated = re.sub(r"<think>.*?</think>", "", translated, flags=re.DOTALL).strip()
    except (httpx.HTTPError, KeyError, IndexError, TypeError) as error:
        raise HTTPException(status_code=502, detail="Translation service unavailable") from error

    cache[key] = translated
    return {"translation": translated}
