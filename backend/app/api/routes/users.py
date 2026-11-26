from fastapi import APIRouter

from app.api.controllers.user_controller import UserController
from app.api.controllers.auth_controller import AuthController

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# ==========================================
# EMPLOYEE PROFILE
# ==========================================

router.add_api_route(
    "/me",
    UserController.me,
    methods=["GET"],
    summary="Get Current User Profile",
)

router.add_api_route(
    "/profile",
    UserController.update_profile,
    methods=["PUT"],
    summary="Update Profile",
)

router.add_api_route(
    "/change-password",
    UserController.change_password,
    methods=["POST"],
    summary="Change Password",
)

router.add_api_route(
    "/stats",
    UserController.stats,
    methods=["GET"],
    summary="User Statistics",
)

router.add_api_route(
    "/badges",
    UserController.badges,
    methods=["GET"],
    summary="User Badges",
)

router.add_api_route(
    "/leaderboard",
    UserController.leaderboard,
    methods=["GET"],
    summary="Leaderboard",
)

# ==========================================
# ADMIN USER MANAGEMENT
# URLs become:
# /api/v1/admin/users
# ==========================================

admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin Users"],
)

admin_router.add_api_route(
    "/users/admin/register",
    AuthController.register_admin_by_admin,
    methods=["POST"],
    summary="Create Admin",
)

admin_router.add_api_route(
    "/users",
    UserController.list_users,
    methods=["GET"],
    summary="List Users",
)

admin_router.add_api_route(
    "/users/{user_id}",
    UserController.get_user,
    methods=["GET"],
    summary="Get User By ID",
)

admin_router.add_api_route(
    "/users/{user_id}/role",
    UserController.change_role,
    methods=["PATCH"],
    summary="Change User Role",
)

admin_router.add_api_route(
    "/users/{user_id}/status",
    UserController.toggle_status,
    methods=["PATCH"],
    summary="Activate / Deactivate User",
)

admin_router.add_api_route(
    "/users/{user_id}",
    UserController.delete_user,
    methods=["DELETE"],
    summary="Delete User",
)

