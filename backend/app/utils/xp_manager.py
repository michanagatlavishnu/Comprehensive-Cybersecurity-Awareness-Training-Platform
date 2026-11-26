from app.models.user import User


class XPManager:

    LEVEL_XP = 250

    @staticmethod
    async def award_xp(user: User, xp: int):

        user.xp.total_xp += xp

        new_level = (user.xp.total_xp // XPManager.LEVEL_XP) + 1

        if new_level > user.xp.current_level:
            user.xp.current_level = new_level

        await user.save()

        return {
            "xp_awarded": xp,
            "total_xp": user.xp.total_xp,
            "level": user.xp.current_level,
        }