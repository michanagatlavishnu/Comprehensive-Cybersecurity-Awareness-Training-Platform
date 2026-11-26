from fastapi import Query, status

from app.dependencies.auth import CurrentAdmin, CurrentUser
from app.schemas.user import (
    ChangeRoleRequest,
    ToggleUserStatusRequest,
    UpdateProfileRequest,
    ChangePasswordRequest,
)
from app.services.user_service import UserService
from app.utils.response.api_response import success_response


class UserController:

    # ==========================================
    # EMPLOYEE PROFILE
    # ==========================================

    @staticmethod
    async def me(current_user: CurrentUser):
        return success_response(
            message="Profile fetched successfully.",
            data=await UserService.get_profile(current_user),
        )

    @staticmethod
    async def update_profile(
        payload: UpdateProfileRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Profile updated successfully.",
            data=await UserService.update_profile(current_user, payload),
        )

    @staticmethod
    async def stats(current_user: CurrentUser):
        return success_response(
            message="User statistics fetched successfully.",
            data=await UserService.user_stats(current_user),
        )

    @staticmethod
    async def badges(current_user: CurrentUser):
        return success_response(
            message="Badges fetched successfully.",
            data=await UserService.get_user_badges(current_user),
        )

    @staticmethod
    async def leaderboard(current_user: CurrentUser):
        return success_response(
            message="Leaderboard fetched successfully.",
            data=await UserService.leaderboard(),
        )

    # ==========================================
    # ADMIN USER MANAGEMENT
    # ==========================================

    @staticmethod
    async def list_users(
        current_admin: CurrentAdmin,
        page: int = Query(1, ge=1),
        limit: int = Query(10, ge=1, le=100),
        search: str | None = None,
        role: str | None = None,
    ):
        return success_response(
            message="Users fetched successfully.",
            data=await UserService.get_users(page, limit, search, role),
        )

    @staticmethod
    async def get_user(
        user_id: str,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="User fetched successfully.",
            data=await UserService.get_user(user_id),
        )

    @staticmethod
    async def change_role(
        user_id: str,
        payload: ChangeRoleRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="User role updated successfully.",
            data=await UserService.change_role(user_id, payload.role),
        )

    @staticmethod
    async def toggle_status(
        user_id: str,
        payload: ToggleUserStatusRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="User status updated successfully.",
            data=await UserService.toggle_user_status(
                user_id,
                payload.is_active,
            ),
        )

    @staticmethod
    async def delete_user(
        user_id: str,
        current_admin: CurrentAdmin,
    ):
        await UserService.delete_user(user_id)

        return success_response(
            message="User deleted successfully.",
        )

    @staticmethod
    async def change_password(
        payload: ChangePasswordRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Password updated successfully.",
            data=await UserService.change_password(
                current_user,
                payload.current_password,
                payload.new_password,
            ),
        )