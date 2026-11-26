from app.models.user import User


class XPManager:
    """
    Central XP Manager for CyberAware.
    Every feature awards XP through this service.
    """

    LEVEL_XP = 300

    @staticmethod
    async def award_xp(user: User, amount: int):

        user.xp.total_xp += amount

        # Level calculation
        user.xp.current_level = (
            user.xp.total_xp // XPManager.LEVEL_XP
        ) + 1

        await user.save()

        return {
            "xp": user.xp.total_xp,
            "level": user.xp.current_level,
        }

    @staticmethod
    async def award_awareness_score(user: User, percentage: float):

        # Average awareness score across quizzes
        current = user.awareness_score

        if current == 0:
            user.awareness_score = int(percentage)
        else:
            user.awareness_score = int(
                (current + percentage) / 2
            )

        await user.save()

        return user.awareness_score