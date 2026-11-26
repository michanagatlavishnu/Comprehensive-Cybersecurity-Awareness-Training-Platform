from datetime import datetime, timezone, timedelta
from statistics import mean

from app.models.user import User
from app.models.notification import Notification
from app.models.lesson import Lesson
from app.models.training import TrainingModule
from app.models.quiz import Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.user_progress import UserProgress
from app.models.learning_activity import LearningActivity
from app.models.certificate import Certificate
from app.models.phishing_campaign import PhishingCampaign, CampaignStatus
from app.models.phishing_email import PhishingEmail

from app.services.user_service import UserService
from app.services.risk_score_service import RiskScoreService
from app.services.localization_service import LocalizationService


class DashboardService:

    # =====================================================
    # EMPLOYEE DASHBOARD
    # =====================================================

    @staticmethod
    async def employee_dashboard(current_user: User):

        notifications = (
            await Notification.find(
                Notification.user.id == current_user.id
            )
            .sort([("created_at", -1)])
            .limit(5)
            .to_list()
        )

        leaderboard = await UserService.leaderboard(limit=5)

        certificates = await Certificate.find(
            Certificate.user.id == current_user.id
        ).count()

        completed_lessons = await UserProgress.find(
            {
                "user.$id": current_user.id,
                "completed": True,
            }
        ).count()

        total_lessons = await Lesson.find(
            Lesson.is_published == True
        ).count()

        total_modules = await TrainingModule.find(
            TrainingModule.is_published == True
        ).count()

        lesson_progress = (
            round((completed_lessons / total_lessons) * 100, 2)
            if total_lessons
            else 0
        )

        published_quizzes = await Quiz.find(
            Quiz.is_published == True
        ).to_list()
        pending_quizzes = 0
        for quiz in published_quizzes:
            lesson = await quiz.lesson.fetch()
            lesson_id = getattr(lesson, "id", None)
            if lesson_id is None:
                lesson_id = getattr(getattr(quiz.lesson, "ref", None), "id", None)
            if lesson_id is None:
                continue
            lesson_done = await UserProgress.find_one(
                {
                    "user.$id": current_user.id,
                    "lesson.$id": lesson_id,
                    "completed": True,
                }
            )
            passed = await QuizAttempt.find_one({
                "user.$id": current_user.id,
                "quiz.$id": quiz.id,
                "passed": True,
            })
            if lesson_done and passed is None:
                pending_quizzes += 1

        recent_activity = []
        lesson_history = await UserProgress.find(
            {
                "user.$id": current_user.id,
                "completed": True,
            }
        ).sort("-completed_at").limit(10).to_list()
        for item in lesson_history:
            lesson_id = getattr(
                getattr(item.lesson, "ref", None),
                "id",
                None,
            )
            lesson = await Lesson.get(lesson_id) if lesson_id else None
            if lesson is None:
                continue
            completed_at = item.completed_at.isoformat() if item.completed_at else None
            recent_activity.append({
                "id": str(item.id),
                "lesson_title": lesson.title,
                "status": "Lesson completed",
                "score": None,
                "completed_at": completed_at,
            })

        quiz_history = await QuizAttempt.find({
            "user.$id": current_user.id,
        }).sort("-completed_at").limit(10).to_list()
        for item in quiz_history:
            quiz = await item.quiz.fetch()
            quiz_id = getattr(quiz, "id", None)
            if quiz is None or quiz_id is None:
                quiz_id = getattr(getattr(item.quiz, "ref", None), "id", None)
                quiz = await Quiz.get(quiz_id) if quiz_id else None
            if quiz is None:
                continue
            lesson = await quiz.lesson.fetch()
            lesson_id = getattr(lesson, "id", None)
            if lesson_id is None:
                lesson_id = getattr(getattr(quiz.lesson, "ref", None), "id", None)
                lesson = await Lesson.get(lesson_id) if lesson_id else None
            if lesson is None:
                continue
            completed_at = item.completed_at.isoformat() if item.completed_at else None
            recent_activity.append({
                "id": str(item.id),
                "lesson_title": lesson.title,
                "status": "Quiz passed" if item.passed else "Quiz attempted",
                "score": item.percentage,
                "completed_at": completed_at,
            })

        download_history = await LearningActivity.find({
            "user.$id": current_user.id,
        }).sort("-created_at").limit(10).to_list()
        for item in download_history:
            recent_activity.append({
                "id": str(item.id),
                "lesson_title": item.lesson_title,
                "status": "Downloaded lesson PDF",
                "score": None,
                "completed_at": item.created_at.isoformat(),
                "course_title": item.course_title,
            })

        recent_activity = [
            item for item in recent_activity
            if item.get("completed_at") is not None
        ]

        recent_activity.sort(
            key=lambda item: item["completed_at"],
            reverse=True,
        )

        activity_dates = {
            item.completed_at.date()
            for item in lesson_history + quiz_history
            if item.completed_at
        }
        learning_streak = 0
        streak_date = datetime.now(timezone.utc).date()
        while streak_date in activity_dates:
            learning_streak += 1
            streak_date -= timedelta(days=1)
        risk_score = await RiskScoreService.employee_risk(current_user)

        dashboard = {
            "welcome": f"Welcome back {current_user.full_name} 👋",

            "profile": {
                "name": current_user.full_name,
                "email": current_user.email,
                "role": current_user.role.value,
                "department": current_user.department,
                "profile_image": current_user.profile_image,
            },

            "stats": {
                "awareness_score": current_user.awareness_score,
                "xp": current_user.xp.total_xp,
                "level": current_user.xp.current_level,
                "completed_modules": current_user.xp.completed_modules,
                "total_modules": total_modules,
                "completed_lessons": completed_lessons,
                "total_lessons": total_lessons,
                "completed_quizzes": current_user.xp.completed_quizzes,
                "phishing_reports": current_user.xp.phishing_reports,
                "lesson_progress": lesson_progress,
                "certificates": certificates,
                "phishing_risk_score": risk_score,
                "pending_quizzes": pending_quizzes,
                "learning_streak": learning_streak,
            },

            "recent_activity": recent_activity[:10],

            "recent_notifications": [
                {
                    "id": str(item.id),
                    "title": item.title,
                    "message": item.message,
                    "type": item.type,
                    "is_read": item.is_read,
                    "created_at": item.created_at.isoformat(),
                }
                for item in notifications
            ],

            "leaderboard_preview": leaderboard,
        }

        return dashboard

    # =====================================================
    # WEEKLY ACTIVITY GRAPH
    # =====================================================

    @staticmethod
    async def weekly_activity(current_user: User):

        today = datetime.now(timezone.utc)
        activity = []

        for i in range(6, -1, -1):
            day = today - timedelta(days=i)

            activity.append({
                "date": day.strftime("%a"),
                "xp": max(20, current_user.xp.total_xp // (i + 2)),
                "quizzes": max(
                    0,
                    current_user.xp.completed_quizzes - i
                ),
                "modules": max(
                    0,
                    current_user.xp.completed_modules - i
                ),
            })

        return await LocalizationService.dashboard(
            activity,
            current_user.language,
        )

    # =====================================================
    # LEARNING PROGRESS (Dashboard Progress Ring)
    # =====================================================

    @staticmethod
    async def learning_progress(current_user: User):

        total_modules = await TrainingModule.find(
            TrainingModule.is_published == True
        ).count()

        total_lessons = await Lesson.find(
            Lesson.is_published == True
        ).count()

        completed_lessons = await UserProgress.find(
            {
                "user.$id": current_user.id,
                "completed": True,
            }
        ).count()

        total_quizzes = await Quiz.find(
            Quiz.is_published == True
        ).count()

        completed_quizzes = await QuizAttempt.find({
            "user.$id": current_user.id,
            "passed": True,
        }).count()

        lesson_progress = (
            round((completed_lessons / total_lessons) * 100, 2)
            if total_lessons
            else 0
        )

        module_progress = (
            round(
                (current_user.xp.completed_modules / total_modules) * 100,
                2,
            )
            if total_modules
            else 0
        )

        quiz_progress = (
            round((completed_quizzes / total_quizzes) * 100, 2)
            if total_quizzes
            else 0
        )

        progress = {
            "completed_modules": current_user.xp.completed_modules,
            "total_modules": total_modules,
            "module_progress": module_progress,

            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "lesson_progress": lesson_progress,

            "completed_quizzes": completed_quizzes,
            "total_quizzes": total_quizzes,
            "quiz_progress": quiz_progress,

            "awareness_score": current_user.awareness_score,
            "xp": current_user.xp.total_xp,
            "level": current_user.xp.current_level,
        }

        return await LocalizationService.dashboard(
            progress,
            current_user.language,
        )

    # =====================================================
    # XP HISTORY
    # =====================================================

    @staticmethod
    async def xp_history(current_user: User):

        history = await UserProgress.find(
            {
                "user.$id": current_user.id,
                "completed": True,
            }
        ).sort([("completed_at", 1)]).to_list()

        total = 0
        graph = []

        for item in history:
            if item.completed_at is None:
                continue
            total += item.xp_awarded

            graph.append({
                "day": item.completed_at.strftime("%d %b"),
                "xp": total,
            })

        if not graph:
            graph = [
                {"day": "Start", "xp": 0}
            ]

        return await LocalizationService.dashboard(
            graph,
            current_user.language,
        )

    # =====================================================
    # ADMIN DASHBOARD
    # =====================================================

    @staticmethod
    async def admin_dashboard():

        users = await User.find_all().to_list()
        simulation_emails = await PhishingEmail.find_all().to_list()
        identified_simulations = [email for email in simulation_emails if email.identified]
        correct_simulations = [email for email in identified_simulations if email.decision_correct]

        awareness = (
            mean([u.awareness_score for u in users])
            if users
            else 0
        )

        leaderboard = await UserService.leaderboard(limit=10)

        recent_activity = []
        progress_items = await UserProgress.find({"completed": True}).sort("-completed_at").limit(10).to_list()
        for item in progress_items:
            await item.fetch_link(UserProgress.user)
            await item.fetch_link(UserProgress.lesson)
            recent_activity.append({
                "id": str(item.id),
                "user": item.user.full_name,
                "email": item.user.email,
                "activity": f"Completed lesson: {item.lesson.title}",
                "created_at": item.completed_at.isoformat() if item.completed_at else None,
            })

        return {
            "cards": {
                "total_users": len(users),
                "verified_users": sum(u.is_verified for u in users),
                "active_users": sum(u.is_active for u in users),
                "employees": sum(
                    u.role.value == "employee"
                    for u in users
                ),
                "admins": sum(
                    u.role.value == "admin"
                    for u in users
                ),
                "average_awareness_score": round(awareness, 2),
                "total_xp": sum(
                    u.xp.total_xp
                    for u in users
                ),
                "simulation_identified": len(identified_simulations),
                "simulation_correct": len(correct_simulations),
                "simulation_accuracy": round(
                    len(correct_simulations) / len(identified_simulations) * 100,
                    2,
                ) if identified_simulations else 0,
            },

            "recent_users": [
                {
                    "name": u.full_name,
                    "email": u.email,
                    "department": u.department,
                    "created_at": u.created_at.isoformat(),
                }
                for u in sorted(
                    users,
                    key=lambda x: x.created_at,
                    reverse=True,
                )[:5]
            ],

            "recent_activity": recent_activity,

            "leaderboard": leaderboard,
        }

    # =====================================================
    # ADMIN ANALYTICS
    # =====================================================

    @staticmethod
    async def awareness_distribution():

        users = await User.find_all().to_list()

        buckets = {
            "0-20": 0,
            "21-40": 0,
            "41-60": 0,
            "61-80": 0,
            "81-100": 0,
        }

        for user in users:
            score = user.awareness_score

            if score <= 20:
                buckets["0-20"] += 1
            elif score <= 40:
                buckets["21-40"] += 1
            elif score <= 60:
                buckets["41-60"] += 1
            elif score <= 80:
                buckets["61-80"] += 1
            else:
                buckets["81-100"] += 1

        return [
            {
                "range": key,
                "users": value,
            }
            for key, value in buckets.items()
        ]

    @staticmethod
    async def department_analytics():
        return await UserService.department_stats()

    @staticmethod
    async def security_metrics():

        users = await User.find_all().to_list()

        return {
            "phishing_reports": sum(
                u.xp.phishing_reports
                for u in users
            ),
            "quizzes_completed": sum(
                u.xp.completed_quizzes
                for u in users
            ),
            "modules_completed": sum(
                u.xp.completed_modules
                for u in users
            ),
            "certificates_generated": await Certificate.find_all().count(),
            "active_campaigns": await PhishingCampaign.find(
                PhishingCampaign.status == CampaignStatus.RUNNING
            ).count(),
        }

    @staticmethod
    async def weekly_trend():
        today = datetime.now(timezone.utc).date()
        users = await User.find_all().to_list()
        progress = await UserProgress.find(
            {"completed": True}
        ).to_list()
        attempts = await QuizAttempt.find_all().to_list()

        graph = []
        for offset in range(6, -1, -1):
            day = today - timedelta(days=offset)
            graph.append({
                "day": day.strftime("%a"),
                "new_users": sum(
                    1 for user in users
                    if user.created_at and user.created_at.date() == day
                ),
                "completed_modules": sum(
                    1 for item in progress
                    if item.completed_at and item.completed_at.date() == day
                ),
                "quizzes": sum(
                    1 for attempt in attempts
                    if attempt.completed_at and attempt.completed_at.date() == day
                ),
            })

        return graph