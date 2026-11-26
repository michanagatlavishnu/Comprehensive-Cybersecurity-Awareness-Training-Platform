import time
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.utils.helpers.logger import get_logger

logger = get_logger("request")


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())

        request.state.request_id = request_id

        start = time.perf_counter()

        logger.info(
            f"[{request_id}] Incoming {request.method} {request.url.path}"
        )

        response = await call_next(request)

        duration = round((time.perf_counter() - start) * 1000, 2)

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration} ms"

        logger.info(
            f"[{request_id}] {response.status_code} completed in {duration} ms"
        )

        return response