from pydantic import BaseModel


class UpdateLanguageRequest(BaseModel):
    language: str


class LanguageResponse(BaseModel):
    language: str
    supported_languages: list[str]