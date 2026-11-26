from fastapi import Query

from app.dependencies.auth import CurrentAdmin, CurrentUser
from app.schemas.module import ModuleCreateRequest, ModuleUpdateRequest
from app.services.module_service import ModuleService
from app.utils.response.api_response import success_response


class ModuleController:

    # ======================================
    # EMPLOYEE APIs
    # ======================================

    @staticmethod
    async def list_modules(
        current_user: CurrentUser,
        category: str | None = Query(None),
        difficulty: str | None = Query(None),
        search: str | None = Query(None),
    ):
        modules = await ModuleService.get_modules(
            category=category,
            difficulty=difficulty,
            search=search,
            current_user=current_user,
        )

        return success_response(
            message="Learning modules fetched successfully.",
            data=modules,
        )

    @staticmethod
    async def module_details(
        module_id: str,
        current_user: CurrentUser,
    ):
        module = await ModuleService.get_module(module_id, current_user)

        return success_response(
            message="Module fetched successfully.",
            data=module,
        )

    # ======================================
    # ADMIN APIs
    # ======================================

    @staticmethod
    async def create_module(
        payload: ModuleCreateRequest,
        current_admin: CurrentAdmin,
    ):
        module = await ModuleService.create_module(payload, current_admin)

        return success_response(
            message="Module created successfully.",
            data=module,
        )

    @staticmethod
    async def update_module(
        module_id: str,
        payload: ModuleUpdateRequest,
        current_admin: CurrentAdmin,
    ):
        module = await ModuleService.update_module(module_id, payload)

        return success_response(
            message="Module updated successfully.",
            data=module,
        )

    @staticmethod
    async def delete_module(
        module_id: str,
        current_admin: CurrentAdmin,
    ):
        await ModuleService.delete_module(module_id)

        return success_response(
            message="Module deleted successfully.",
        )