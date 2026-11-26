from typing import Optional

from beanie import PydanticObjectId
from pymongo import DESCENDING

from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)
from app.models.user import User
from app.schemas.user import (
    UpdateProfileRequest,
)
from app.utils.helpers.constants import UserRole
from app.models.badge import Badge
from app.models.achievement import Achievement
from app.models.notification import Notification
from app.core.security.password import hash_password, verify_password

class UserService:

    @staticmethod
    async def change_password(user: User, current_password: str, new_password: str):
        if not verify_password(current_password, user.password):
            raise BadRequestException("Current password is incorrect.")
        user.password = hash_password(new_password)
        user.refresh_token = None
        await user.save()
        return True

    # =====================================================
    # Serialize User
    # =====================================================

    @staticmethod
    def serialize_user(user: User):
        return {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value,
            "language": user.language.value,
            "company": user.company,
            "department": user.department,
            "designation": user.designation,
            "profile_image": user.profile_image,
            "awareness_score": user.awareness_score,
            "xp": user.xp.total_xp,
            "level": user.xp.current_level,
            "completed_modules": user.xp.completed_modules,
            "completed_quizzes": user.xp.completed_quizzes,
            "phishing_reports": user.xp.phishing_reports,
            "is_verified": user.is_verified,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }

    # =====================================================
    # CURRENT PROFILE
    # =====================================================

    @staticmethod
    async def get_profile(current_user: User):
        return UserService.serialize_user(current_user)

    # =====================================================
    # UPDATE PROFILE
    # =====================================================

    @staticmethod
    async def update_profile(
        current_user: User,
        payload: UpdateProfileRequest,
    ):

        data = payload.model_dump(exclude_none=True)

        for key, value in data.items():
            setattr(current_user, key, value)

        await current_user.save()

        return UserService.serialize_user(current_user)

    # =====================================================
    # GET USER BY ID
    # =====================================================

    @staticmethod
    async def get_user(user_id: str):

        user = await User.get(PydanticObjectId(user_id))

        if not user:
            raise NotFoundException("User not found.")

        return UserService.serialize_user(user)

    # =====================================================
    # LIST USERS (ADMIN)
    # =====================================================

    @staticmethod
    async def get_users(
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        role: Optional[str] = None,
    ):

        query = {}

        if search:
            query["$or"] = [
                {
                    "full_name": {
                        "$regex": search,
                        "$options": "i",
                    }
                },
                {
                    "email": {
                        "$regex": search,
                        "$options": "i",
                    }
                },
                {
                    "department": {
                        "$regex": search,
                        "$options": "i",
                    }
                },
            ]

        if role:
            query["role"] = role

        skip = (page - 1) * limit

        users = (
            await User.find(query)
            .sort([("created_at", DESCENDING)])
            .skip(skip)
            .limit(limit)
            .to_list()
        )

        total = await User.find(query).count()

        return {
            "items": [
                UserService.serialize_user(user)
                for user in users
            ],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit,
            },
        }

    # =====================================================
    # CHANGE ROLE
    # =====================================================

    @staticmethod
    async def change_role(
        user_id: str,
        role: str,
    ):

        user = await User.get(PydanticObjectId(user_id))

        if not user:
            raise NotFoundException("User not found.")

        if role not in [
            UserRole.ADMIN.value,
            UserRole.EMPLOYEE.value,
        ]:
            raise BadRequestException("Invalid role.")

        user.role = UserRole(role)

        await user.save()

        return UserService.serialize_user(user)

    # =====================================================
    # ACTIVATE / DEACTIVATE USER
    # =====================================================

    @staticmethod
    async def toggle_user_status(
        user_id: str,
        is_active: bool,
    ):

        user = await User.get(PydanticObjectId(user_id))

        if not user:
            raise NotFoundException("User not found.")

        user.is_active = is_active

        await user.save()

        return UserService.serialize_user(user)

    # =====================================================
    # DELETE USER
    # =====================================================

    @staticmethod
    async def delete_user(user_id: str):

        user = await User.get(PydanticObjectId(user_id))

        if not user:
            raise NotFoundException("User not found.")

        await user.delete()

        return True
    
    
    
    
    @staticmethod
    def calculate_level(total_xp: int) -> int:
        """
        XP → Level Mapping
        Every 200 XP = New Level
        Level starts from 1.
        """
        return max(1, (total_xp // 200) + 1)

    @staticmethod
    async def add_xp(
        user: User,
        xp_points: int,
        reason: str = "Completed activity",
    ):
        """
        Adds XP and recalculates level.
        Also checks badge unlocks.
        """

        user.xp.total_xp += xp_points
        user.xp.current_level = UserService.calculate_level(
            user.xp.total_xp
        )

        await user.save()

        # Badge unlock check
        await UserService.unlock_badges(user)

        # Notification
        notification = Notification(
            user=user,
            title="XP Earned",
            message=f"You earned {xp_points} XP • {reason}",
            type="success",
        )

        await notification.insert()

        return UserService.serialize_user(user)

    # =====================================================
    # BADGE UNLOCK SYSTEM
    # =====================================================

    @staticmethod
    async def unlock_badges(user: User):

        badges = await Badge.find_all().to_list()

        unlocked = []

        for badge in badges:

            if badge.xp_reward > user.xp.total_xp:
                continue

            exists = await Achievement.find_one(
                Achievement.user.id == user.id,
                Achievement.badge.id == badge.id,
            )

            if exists:
                continue

            achievement = Achievement(
                user=user,
                badge=badge,
            )

            await achievement.insert()

            unlocked.append(badge.title)

            notification = Notification(
                user=user,
                title="Badge Unlocked 🏆",
                message=f"You unlocked {badge.title}",
                type="success",
            )

            await notification.insert()

        return unlocked

    @staticmethod
    async def unlock_quiz_badge(user: User):
        badge = await Badge.find_one({"title": "Quiz Finisher"})
        if badge is None:
            badge = Badge(
                title="Quiz Finisher",
                description="Passed a CyberAware quiz.",
                icon="quiz",
                xp_reward=0,
            )
            await badge.insert()

        exists = await Achievement.find_one({
            "user.$id": user.id,
            "badge.$id": badge.id,
        })
        if exists:
            return False

        await Achievement(
            user=user,
            badge=badge,
        ).insert()
        await Notification(
            user=user,
            title="Badge Unlocked",
            message="You unlocked Quiz Finisher.",
            type="success",
        ).insert()
        return True

    @staticmethod
    async def unlock_phishing_hunter_badge(user: User):
        badge = await Badge.find_one({"title": "Phishing Hunter"})
        if badge is None:
            badge = Badge(
                title="Phishing Hunter",
                description="Correctly identified every assigned phishing simulation.",
                icon="shield-check",
                xp_reward=0,
            )
            await badge.insert()

        exists = await Achievement.find_one({
            "user.$id": user.id,
            "badge.$id": badge.id,
        })
        if exists:
            return False

        await Achievement(user=user, badge=badge).insert()
        await Notification(
            user=user,
            title="Badge Unlocked",
            message="You unlocked Phishing Hunter.",
            type="success",
        ).insert()
        return True

    # =====================================================
    # USER BADGES
    # =====================================================

    @staticmethod
    async def get_user_badges(current_user: User):

        achievements = (
            await Achievement.find(
                Achievement.user.id == current_user.id
            )
            .fetch_links()
            .to_list()
        )

        result = []

        for item in achievements:
            badge = item.badge

            result.append({
                "title": badge.title,
                "description": badge.description,
                "icon": badge.icon,
                "xp_reward": badge.xp_reward,
                "unlocked_at": item.unlocked_at,
            })

        return result

    # =====================================================
    # LEADERBOARD
    # =====================================================

    @staticmethod
    async def leaderboard(limit: int = 20):

        # Get all active users
        users = await User.find(
            User.is_active == True
        ).to_list()

        # Sort in Python:
        # 1. Highest XP
        # 2. Highest Awareness Score
        users.sort(
            key=lambda user: (
                user.xp.total_xp,
                user.awareness_score,
            ),
            reverse=True,
        )

        leaderboard = []

        for rank, user in enumerate(users[:limit], start=1):
            leaderboard.append(
                {
                    "rank": rank,
                    "id": str(user.id),
                    "full_name": user.full_name,
                    "department": user.department,
                    "xp": user.xp.total_xp,
                    "level": user.xp.current_level,
                    "awareness_score": user.awareness_score,
                    "profile_image": user.profile_image,
                }
            )

        return leaderboard

    # =====================================================
    # AVATAR UPDATE
    # =====================================================

    @staticmethod
    async def update_avatar(
        current_user: User,
        image_path: str,
    ):

        current_user.profile_image = image_path

        await current_user.save()

        return UserService.serialize_user(current_user)

    # =====================================================
    # USER STATS
    # =====================================================

    @staticmethod
    async def user_stats(current_user: User):

        achievements = await Achievement.find(
            Achievement.user.id == current_user.id
        ).count()

        unread_notifications = await Notification.find(
            Notification.user.id == current_user.id,
            Notification.is_read == False,
        ).count()

        return {
            "awareness_score": current_user.awareness_score,
            "xp": current_user.xp.total_xp,
            "level": current_user.xp.current_level,
            "completed_modules": current_user.xp.completed_modules,
            "completed_quizzes": current_user.xp.completed_quizzes,
            "phishing_reports": current_user.xp.phishing_reports,
            "badges": achievements,
            "notifications": unread_notifications,
        }

    # =====================================================
    # ADMIN DASHBOARD HELPERS
    # =====================================================

    @staticmethod
    async def admin_counts():

        total_users = await User.find_all().count()

        verified_users = await User.find(
            User.is_verified == True
        ).count()

        active_users = await User.find(
            User.is_active == True
        ).count()

        admins = await User.find(
            User.role == UserRole.ADMIN
        ).count()

        employees = await User.find(
            User.role == UserRole.EMPLOYEE
        ).count()

        return {
            "total_users": total_users,
            "verified_users": verified_users,
            "active_users": active_users,
            "admins": admins,
            "employees": employees,
        }

    # =====================================================
    # DEPARTMENT ANALYTICS
    # =====================================================

    @staticmethod
    async def department_stats():

        users = await User.find_all().to_list()

        stats = {}

        for user in users:

            department = user.department or "Others"

            if department not in stats:
                stats[department] = {
                    "department": department,
                    "users": 0,
                    "average_awareness_score": 0,
                    "average_xp": 0,
                }

            stats[department]["users"] += 1
            stats[department]["average_awareness_score"] += user.awareness_score
            stats[department]["average_xp"] += user.xp.total_xp

        result = []

        for value in stats.values():

            count = value["users"]

            value["average_awareness_score"] = round(
                value["average_awareness_score"] / count,
                2,
            )

            value["average_xp"] = round(
                value["average_xp"] / count,
                2,
            )

            result.append(value)

        result.sort(key=lambda x: x["users"], reverse=True)

        return result

    # =====================================================
    # RECENT USERS
    # =====================================================

    @staticmethod
    async def recent_users(limit: int = 10):

        users = (
            await User.find_all()
            .sort([("created_at", DESCENDING)])
            .limit(limit)
            .to_list()
        )

        return [
            UserService.serialize_user(user)
            for user in users
        ]

    # =====================================================
    # SEARCH USERS
    # =====================================================

    @staticmethod
    async def search_users(search: str):

        users = await User.find({
            "$or": [
                {
                    "full_name": {
                        "$regex": search,
                        "$options": "i",
                    }
                },
                {
                    "email": {
                        "$regex": search,
                        "$options": "i",
                    }
                },
                {
                    "department": {
                        "$regex": search,
                        "$options": "i",
                    }
                },
            ]
        }).limit(30).to_list()

        return [
            UserService.serialize_user(user)
            for user in users
        ]