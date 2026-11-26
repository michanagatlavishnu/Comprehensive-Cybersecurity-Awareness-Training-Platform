from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from beanie import PydanticObjectId

from app.core.exceptions import UnauthorizedException
from app.core.security.jwt import verify_token
from app.models.user import User

# Swagger + JWT Bearer Authentication
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> User:
    """
    Get currently authenticated user from JWT access token.
    """

    # No Authorization header
    if credentials is None:
        raise UnauthorizedException("Authorization token missing.")

    token = credentials.credentials

    # Verify JWT
    payload = verify_token(token)

    if payload is None:
        raise UnauthorizedException("Invalid or expired token.")

    if payload.get("type") != "access":
        raise UnauthorizedException("Access token required.")

    # Find user in MongoDB
    user = await User.get(PydanticObjectId(payload["sub"]))

    if user is None:
        raise UnauthorizedException("User not found.")

    if not user.is_active:
        raise UnauthorizedException("Account is inactive.")

    return user