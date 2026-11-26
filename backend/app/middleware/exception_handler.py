from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.utils.helpers.logger import get_logger

logger = get_logger("exceptions")


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
                "request_id": getattr(request.state, "request_id", None),
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        logger.warning(
            "Request validation failed for %s: %s",
            request.url.path,
            exc.errors(),
        )
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "message": "Validation Error",
                "errors": exc.errors(),
                "request_id": getattr(request.state, "request_id", None),
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):
        logger.exception(str(exc))

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
                "request_id": getattr(request.state, "request_id", None),
            },
        )