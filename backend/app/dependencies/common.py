from fastapi import Depends, Query

from app.middleware.rate_limiter import limiter


def pagination(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit

    return {
        "page": page,
        "limit": limit,
        "skip": skip,
    }


def search_query(
    search: str | None = Query(None),
):
    return search