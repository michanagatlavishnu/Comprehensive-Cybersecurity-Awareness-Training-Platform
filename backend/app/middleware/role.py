from fastapi import Depends

from app.middleware.auth import get_current_user
from app.models.user import User
from app.core.exceptions import ForbiddenException
from app.utils.helpers.constants import UserRole


def require_admin():
    async def dependency(
        current_user: User = Depends(get_current_user),
    ):
        if current_user.role != UserRole.ADMIN:
            raise ForbiddenException("Admin access required.")
        return current_user

    return dependency


def require_employee():
    async def dependency(
        current_user: User = Depends(get_current_user),
    ):
        if current_user.role != UserRole.EMPLOYEE:
            raise ForbiddenException("Employee access required.")
        return current_user

    return dependency