from app.models.lesson import Lesson
from app.models.user_progress import UserProgress
from app.models.user import User


class RetrainingService:

    PHISHING_TOPICS = [
        "Phishing Fundamentals",
        "Email Security Basics",
        "Spotting Fake Login Pages",
        "Credential Theft Awareness",
    ]

    @staticmethod
    async def assign_phishing_retraining(user: User):

        lessons = await Lesson.find(
            Lesson.is_published == True
        ).to_list()

        assigned = 0

        for lesson in lessons:

            if lesson.title not in RetrainingService.PHISHING_TOPICS:
                continue

            exists = await UserProgress.find_one(
                UserProgress.user.id == user.id,
                UserProgress.lesson.id == lesson.id,
            )

            if exists:
                exists.completed = False
                exists.completed_at = None
                await exists.save()
                continue

            await UserProgress(
                user=user,
                lesson=lesson,
                module=lesson.module,
                completed=False,
                xp_awarded=0,
            ).insert()

            assigned += 1

        return {"assigned_lessons": assigned}

    @staticmethod
    async def restore_awareness_after_completion(user: User):

        user.awareness_score = min(
            100,
            user.awareness_score + 10,
        )

        user.xp.total_xp += 30

        await user.save()

        return {
            "awareness_score": user.awareness_score,
            "xp": user.xp.total_xp,
        }