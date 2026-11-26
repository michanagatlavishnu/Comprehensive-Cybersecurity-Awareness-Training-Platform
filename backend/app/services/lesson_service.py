from datetime import datetime
from beanie import PydanticObjectId
from app.core.exceptions import NotFoundException
from beanie import PydanticObjectId
from pymongo import ASCENDING
from app.models.certificate import Certificate
from app.services.certificate_service import CertificateService
from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.models.lesson import Lesson, LessonStatus
from app.models.module import LearningModule
from app.models.user import User
from app.models.user_progress import UserProgress
from app.services.notification_service import NotificationService
from app.utils.xp_manager import XPManager
from app.services.localization_service import LocalizationService
from app.models.lesson import Lesson, LessonStatus, LessonContent
from app.core.ai.groq_client import GroqClient
from fastapi import HTTPException
class LessonService:

    @staticmethod
    async def ai_notes(lesson_id: str, current_user: User):
        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if lesson is None or not lesson.is_published:
            raise NotFoundException("Lesson not found.")

        source = lesson.content.markdown or lesson.short_description or ""
        if not source.strip():
            title = lesson.title.lower()
            if "hash" in title:
                source = (
                    "Explain cryptographic hashing, one-way functions, fixed-length digests, "
                    "avalanche effect, collision resistance, password hashing with salts, "
                    "and why hashes are used for integrity verification."
                )
            elif "nft" in title or "cryptocurrency" in title:
                source = (
                    "Explain cryptocurrency as digital value secured by a blockchain, and NFTs "
                    "as unique blockchain tokens representing ownership or access. Cover wallets, "
                    "transactions, private keys, scams, and safe handling of digital assets."
                )
            else:
                source = f"Create foundational cybersecurity notes for the lesson topic: {lesson.title}."
        prompt = f"""
Create concise study notes for this CyberAware lesson.
Lesson title: {lesson.title}
Lesson content:
{source}

Return plain text with these headings:
Overview
Key concepts
Practical security takeaways
Self-check questions
Use standard cybersecurity knowledge to explain the supplied lesson topic accurately.
"""

        content = await GroqClient.chat([
            {
                "role": "system",
                "content": "You are a precise cybersecurity training assistant.",
            },
            {"role": "user", "content": prompt},
        ])

        return {
            "lesson_id": lesson_id,
            "title": lesson.title,
            "content": content,
        }

    # =====================================================
    # ADMIN
    # =====================================================

    @staticmethod
    async def list_lessons(
        module_id: str,
        admin=False,
        current_user: User | None = None,
    ):
        try:
            module_object_id = PydanticObjectId(module_id)
        except Exception:
            raise NotFoundException("Invalid learning module ID.")

        module = await LearningModule.get(module_object_id)

        if module is None:
            raise NotFoundException("Learning module not found.")

        query = Lesson.find(Lesson.module.id == module.id)

        if not admin:
            query = query.find(Lesson.is_published == True)

        lessons = await query.sort([("lesson_number", ASCENDING)]).to_list()

        # IMPORTANT: Fetch linked module before serialize
        for lesson in lessons:
            await lesson.fetch_link(Lesson.module)

        print(f"LESSONS FOUND: {len(lessons)}")

        progress_by_lesson = {}
        if current_user is not None:
            progress_records = await UserProgress.find(
                UserProgress.user.id == current_user.id,
                UserProgress.module.id == module.id,
            ).to_list()
            for progress in progress_records:
                await progress.fetch_link(UserProgress.lesson)
            progress_by_lesson = {
                str(item.lesson.id): item for item in progress_records
            }

        return [
            LessonService.serialize(
                item,
                progress_by_lesson.get(str(item.id)),
            )
            for item in lessons
        ]

    

    @staticmethod
    async def get_lesson(lesson_id: str):

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        await lesson.fetch_link(Lesson.module)

        return LessonService.serialize(lesson)

    @staticmethod
    async def update_lesson(lesson_id: str, payload):

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        update_data = payload.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(lesson, key, value)

        lesson.updated_at = datetime.utcnow()

        await lesson.save()

        return LessonService.serialize(lesson)

    @staticmethod
    async def delete_lesson(lesson_id: str):

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        await lesson.fetch_link(Lesson.module)

        module = lesson.module

        await lesson.delete()

        module.total_lessons = max(module.total_lessons - 1, 0)

        await module.save()

        return True

    @staticmethod
    async def publish_lesson(lesson_id: str, publish: bool):

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        lesson.is_published = publish
        lesson.status = (
            LessonStatus.PUBLISHED
            if publish
            else LessonStatus.DRAFT
        )

        await lesson.save()
        await lesson.fetch_link(Lesson.module)

        return LessonService.serialize(lesson)

    @staticmethod
    async def reorder_lessons(payload):

        for item in payload.lessons:

            lesson = await Lesson.get(PydanticObjectId(item.lesson_id))

            if not lesson:
                raise NotFoundException("Lesson not found.")

            lesson.lesson_number = item.lesson_number
            await lesson.save()

        return {"message": "Lessons reordered successfully."}

    # =====================================================
    # EMPLOYEE
    # =====================================================

    @staticmethod
    async def employee_lessons(module_id: str, current_user: User):
        # Reuse existing lesson listing logic and return only published lessons
        return await LessonService.list_lessons(
            module_id=module_id,
            admin=False,
            current_user=current_user,
        )

    @staticmethod
    async def employee_lesson(lesson_id: str, current_user: User):

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        if not lesson.is_published:
            raise BadRequestException("Lesson is not published.")

        await lesson.fetch_link(Lesson.module)

        progress = await UserProgress.find_one({
            "user.$id": current_user.id,
            "lesson.$id": lesson.id,
        })

        # Localized lesson response
        lesson_data = {
            "id": str(lesson.id),
            "title": lesson.title,
            "summary": lesson.short_description,
            "markdown_content": lesson.content.markdown,
            "html_content": lesson.content.html,
            "video_url": lesson.content.video_url,
            "image_url": lesson.content.cover_image,
            "markdown": lesson.content.markdown,
            "html": lesson.content.html,
            "estimated_minutes": lesson.estimated_minutes,
            "xp_reward": lesson.xp_reward,
            "progress": 100 if progress and progress.completed else (progress.progress_percent if progress else 0),
            "watch_time": progress.watch_time_seconds if progress else 0,
            "completed": progress.completed if progress else False,
        }

        return await LocalizationService.lesson(
            lesson_data,
            current_user.language,
        )

    # =====================================================
    # SERIALIZER
    # =====================================================

    @staticmethod
    def serialize(lesson: Lesson, progress: UserProgress | None = None):
        return {
            "id": str(lesson.id),
            "module_id": str(lesson.module.id),

            "lesson_number": lesson.lesson_number,
            "title": lesson.title,
            "short_description": lesson.short_description,

            "estimated_minutes": lesson.estimated_minutes,
            "xp_reward": lesson.xp_reward,
            "progress": 100 if progress and progress.completed else (progress.progress_percent if progress else 0),
            "watch_time": progress.watch_time_seconds if progress else 0,
            "completed": progress.completed if progress else False,

            "is_published": lesson.is_published,
            "status": lesson.status.value,

            "content": {
                "markdown": lesson.content.markdown,
                "html": lesson.content.html,
                "video_url": lesson.content.video_url,
                "cover_image": lesson.content.cover_image,
            },

            "created_at": lesson.created_at.isoformat(),
            "updated_at": lesson.updated_at.isoformat(),
        }
        
    # =====================================================
    # COMPLETE LESSON
    # =====================================================

    @staticmethod
    async def update_progress(
        lesson_id: str,
        current_user: User,
        progress_percent: float,
        watch_time_seconds: float,
    ):
        # Get lesson
        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if lesson is None:
            raise NotFoundException("Lesson not found.")

        if not lesson.is_published:
            raise BadRequestException("Lesson is not published.")

        await lesson.fetch_link(Lesson.module)

        # Get existing progress
        progress = await UserProgress.find_one({
            "user.$id": current_user.id,
            "lesson.$id": lesson.id,
        })

        if progress is None:
            progress = UserProgress(
                user=current_user,
                module=lesson.module,
                lesson=lesson,
                progress_percent=0,
                watch_time_seconds=0,
                completed=False,
            )

        # -----------------------------
        # FIX: Handle None values safely
        # -----------------------------
        progress_percent = float(progress_percent or 0)
        watch_time_seconds = float(watch_time_seconds or 0)

        current_progress = float(progress.progress_percent or 0)
        current_watch_time = float(progress.watch_time_seconds or 0)

        progress.progress_percent = max(
            current_progress,
            progress_percent,
        )

        if progress.completed:
            progress.progress_percent = 100

        progress.watch_time_seconds = max(
            current_watch_time,
            watch_time_seconds,
        )

        # Mark lesson completed automatically
        if progress.progress_percent >= 95:
            progress.completed = True

        progress.last_watched_at = datetime.utcnow()

        await progress.save()

        return {
            "lesson_id": str(lesson.id),
            "progress": progress.progress_percent,
            "watch_time": progress.watch_time_seconds,
            "completed": progress.completed,
        }

    @staticmethod
    async def complete_lesson(
        lesson_id: str,
        current_user: User,
    ):

        lesson = await Lesson.get(PydanticObjectId(lesson_id))

        if not lesson:
            raise NotFoundException("Lesson not found.")

        if not lesson.is_published:
            raise BadRequestException("Lesson is not published.")

        await lesson.fetch_link(Lesson.module)

        progress = await UserProgress.find_one({
            "user.$id": current_user.id,
            "lesson.$id": lesson.id,
        })

        if progress and progress.completed:
            progress.progress_percent = 100
            await progress.save()
            return {
                "completed": True,
                "progress": 100,
                "xp_awarded": 0,
                "message": "Lesson already completed.",
            }

        if progress is None or progress.progress_percent < 95:
            raise BadRequestException(
                "Watch at least 95% of the lesson before completing it."
            )

        if progress is None:
            progress = UserProgress(
                user=current_user,
                module=lesson.module,
                lesson=lesson,
            )
            await progress.insert()

        await progress.mark_completed(lesson.xp_reward)

        current_user.xp.completed_modules += 0
        current_user.awareness_score = min(
            100,
            current_user.awareness_score + 1,
        )
        await current_user.save()

        xp = await XPManager.award_xp(
            current_user,
            lesson.xp_reward,
        )

        await NotificationService.create_notification(
            user=current_user,
            title="Lesson Completed 🎉",
            message=f"You completed '{lesson.title}' and earned {lesson.xp_reward} XP.",
            notification_type="success",
        )

        return {
            "completed": True,
            "lesson": lesson.title,
            "progress": 100,
            "xp": xp,
            "module_completed": False,
            "certificate_id": None,
        }
        
    # =====================================================
    # MODULE PROGRESS
    # =====================================================

    @staticmethod
    async def module_progress(
        module_id: str,
        current_user: User,
    ):

        module = await LearningModule.get(PydanticObjectId(module_id))

        if module is None:
            raise NotFoundException("Learning module not found.")

        lessons = await Lesson.find(
            Lesson.module.id == module.id,
            Lesson.is_published == True,
        ).to_list()

        completed = await UserProgress.find(
            UserProgress.user.id == current_user.id,
            UserProgress.module.id == module.id,
            UserProgress.completed == True,
        ).count()

        total = len(lessons)

        percentage = round((completed / total) * 100, 2) if total else 0

        return {
            "module": module.title,
            "completed_lessons": completed,
            "total_lessons": total,
            "percentage": percentage,
        }
        
    # =====================================================
    # COMPLETED LESSONS
    # =====================================================

    @staticmethod
    async def completed_lessons(current_user: User):

        progress = await UserProgress.find(
            UserProgress.user.id == current_user.id,
            UserProgress.completed == True,
        ).to_list()

        lessons = []

        for item in progress:

            await item.fetch_link(UserProgress.lesson)

            lessons.append(
                {
                    "lesson_id": str(item.lesson.id),
                    "title": item.lesson.title,
                    "completed_at": item.completed_at.isoformat() if item.completed_at else None,
                    "xp_awarded": item.xp_awarded,
                }
            )

        return lessons
    
    # =====================================================
    # COMPLETE MODULE IF ALL LESSONS FINISHED
    # =====================================================

    @staticmethod
    async def check_module_completion(
        module,
        current_user,
    ):

        lessons = await Lesson.find(
            Lesson.module.id == module.id,
            Lesson.is_published == True,
        ).to_list()

        total_lessons = len(lessons)

        completed_lessons = await UserProgress.find(
            UserProgress.user.id == current_user.id,
            UserProgress.module.id == module.id,
            UserProgress.completed == True,
        ).count()

        if total_lessons == 0:
            return None

        if completed_lessons != total_lessons:
            return None

        certificate_exists = await Certificate.find_one(
            Certificate.user.id == current_user.id,
            Certificate.module.id == module.id,
        )

        if certificate_exists:
            return certificate_exists

        current_user.xp.completed_modules += 1
        await current_user.save()

        await XPManager.award_xp(
            current_user,
            module.xp_reward,
        )

        certificate = await CertificateService.generate(
            current_user,
            module,
        )

        await NotificationService.create_notification(
            user=current_user,
            title="Module Completed 🏆",
            message=f"You completed '{module.title}' and earned {module.xp_reward} bonus XP!",
            notification_type="success",
        )

        return certificate
    
    
    
    
   

    @staticmethod
    async def create_lesson(module_id: str, payload):

        module = await LearningModule.get(PydanticObjectId(module_id))

        if module is None:
            raise NotFoundException("Learning module not found.")

        lesson_content = LessonContent(
            markdown=payload.content.markdown,
            html=payload.content.html,
            video_url=payload.content.video_url,
            cover_image=payload.content.cover_image,
        )

        lesson = Lesson(
            module=module,
            lesson_number=payload.lesson_number,
            title=payload.title,
            short_description=payload.short_description,
            content=lesson_content,
            estimated_minutes=payload.estimated_minutes,
            xp_reward=payload.xp_reward,
            is_published=False,
            status=LessonStatus.DRAFT,
        )

        await lesson.insert()

        # Update lesson count only if field exists
        module.total_lessons += 1
        module.updated_at = datetime.utcnow()

        await module.save()

        return LessonService.serialize(lesson)