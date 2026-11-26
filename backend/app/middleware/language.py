from starlette.middleware.base import BaseHTTPMiddleware

SUPPORTED_LANGUAGES = ["en", "te", "hi"]


class LanguageMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):

        language = request.headers.get(
            "Accept-Language",
            "en",
        ).lower()

        if language not in SUPPORTED_LANGUAGES:
            language = "en"

        request.state.language = language

        response = await call_next(request)

        response.headers["Content-Language"] = language

        return response