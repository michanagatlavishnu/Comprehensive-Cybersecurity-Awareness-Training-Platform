from datetime import datetime

from beanie import PydanticObjectId

from app.core.exceptions import NotFoundException
from app.models.module import LearningModule
from app.models.user import User
from app.models.user_progress import UserProgress


class ModuleService:

    # ======================================================
    # SERIALIZER
    # ======================================================

    @staticmethod
    def serialize(
        module: LearningModule,
        completed_lessons: int = 0,
    ):
        total_lessons = getattr(module, "total_lessons", 0)
        progress = (
            round((completed_lessons / total_lessons) * 100)
            if total_lessons
            else 0
        )

        return {
            "id": str(module.id),                      # Mongo ObjectId
            "title": module.title,
            "description": module.description,
            "category": module.category,
            "difficulty": module.difficulty,
            "thumbnail": module.thumbnail,
            "estimated_minutes": module.duration_minutes,
            "xp_reward": module.xp_reward,
            "total_lessons": total_lessons,
            "progress": progress,
            "completed": total_lessons > 0 and completed_lessons >= total_lessons,
            "tags": getattr(module, "tags", []),
            "is_published": module.is_published,
            "created_at": module.created_at,
            "updated_at": module.updated_at,
        }

    # ======================================================
    # EMPLOYEE MODULES
    # ======================================================

    @staticmethod
    async def get_modules(
        category=None,
        difficulty=None,
        search=None,
        current_user: User | None = None,
    ):
        query = LearningModule.find(LearningModule.is_published == True)

        if category:
            query = query.find(LearningModule.category == category)

        if difficulty:
            query = query.find(LearningModule.difficulty == difficulty)

        modules = await query.to_list()

        if search:
            modules = [
                module
                for module in modules
                if search.lower() in module.title.lower()
            ]

        serialized = []
        for module in modules:
            completed_lessons = 0
            if current_user is not None:
                completed_lessons = await UserProgress.find(
                    UserProgress.user.id == current_user.id,
                    UserProgress.module.id == module.id,
                    UserProgress.completed == True,
                ).count()
            serialized.append(ModuleService.serialize(module, completed_lessons))

        return serialized

    @staticmethod
    async def get_module(module_id: str, current_user: User | None = None):
        module = await LearningModule.get(PydanticObjectId(module_id))

        if module is None:
            raise NotFoundException("Learning module not found.")

        completed_lessons = 0
        if current_user is not None:
            completed_lessons = await UserProgress.find(
                UserProgress.user.id == current_user.id,
                UserProgress.module.id == module.id,
                UserProgress.completed == True,
            ).count()

        return ModuleService.serialize(module, completed_lessons)

    # ======================================================
    # ADMIN MODULES
    # ======================================================

    @staticmethod
    async def get_admin_modules():
        modules = await LearningModule.find_all().sort(
            [("created_at", -1)]
        ).to_list()

        return [ModuleService.serialize(module) for module in modules]

    # ======================================================
    # CREATE MODULE
    # ======================================================

    @staticmethod
    async def create_module(payload, admin):
        module = LearningModule(
            title=payload.title,
            description=payload.description,
            category=payload.category,
            difficulty=payload.difficulty,
            duration_minutes=payload.duration_minutes,
            xp_reward=payload.xp_reward,
            thumbnail=payload.thumbnail,
            is_published=payload.is_published,
            total_lessons=0,
            tags=[],
            created_by=str(admin.id),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        await module.insert()

        return ModuleService.serialize(module)

    # ======================================================
    # UPDATE MODULE
    # ======================================================

    @staticmethod
    async def update_module(module_id: str, payload):
        module = await LearningModule.get(PydanticObjectId(module_id))

        if module is None:
            raise NotFoundException("Learning module not found.")

        updates = payload.model_dump(exclude_none=True)

        if "duration_minutes" in updates:
            module.duration_minutes = updates.pop("duration_minutes")

        for key, value in updates.items():
            setattr(module, key, value)

        module.updated_at = datetime.utcnow()

        await module.save()

        return ModuleService.serialize(module)

    # ======================================================
    # DELETE MODULE
    # ======================================================

    @staticmethod
    async def delete_module(module_id: str):
        module = await LearningModule.get(PydanticObjectId(module_id))

        if module is None:
            raise NotFoundException("Learning module not found.")

        await module.delete()

        return True

    # ======================================================
    # PUBLISH / UNPUBLISH MODULE
    # ======================================================

    @staticmethod
    async def publish_module(module_id: str, publish: bool):
        module = await LearningModule.get(PydanticObjectId(module_id))

        if module is None:
            raise NotFoundException("Learning module not found.")

        module.is_published = publish
        module.updated_at = datetime.utcnow()

        await module.save()

        return ModuleService.serialize(module)