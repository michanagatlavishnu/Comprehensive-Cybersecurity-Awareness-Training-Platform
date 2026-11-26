from collections import defaultdict
from datetime import datetime, timedelta
from statistics import mean

from app.models.certificate import Certificate
from app.models.question import Question
from app.models.quiz import Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.user import User


class QuizAnalyticsService:
    # =====================================================
    # OVERVIEW CARDS
    # =====================================================

    @staticmethod
    async def overview():

        attempts = await QuizAttempt.find_all().to_list()
        quizzes = await Quiz.find(Quiz.is_published == True).to_list()
        users = await User.find(User.is_active == True).to_list()

        total_attempts = len(attempts)
        total_quizzes = len(quizzes)
        total_users = len(users)

        scores = [attempt.percentage for attempt in attempts]
        average_score = round(mean(scores), 2) if scores else 0

        passed = len([attempt for attempt in attempts if attempt.passed])
        failed = total_attempts - passed

        pass_rate = (
            round((passed / total_attempts) * 100, 2)
            if total_attempts
            else 0
        )

        durations = [attempt.duration_minutes for attempt in attempts]
        average_time = round(mean(durations), 2) if durations else 0

        highest_score = max(scores) if scores else 0
        lowest_score = min(scores) if scores else 0

        return {
            "total_attempts": total_attempts,
            "total_users": total_users,
            "total_quizzes": total_quizzes,
            "average_score": average_score,
            "pass_rate": pass_rate,
            "average_time_minutes": average_time,
            "highest_score": highest_score,
            "lowest_score": lowest_score,
            "generated_at": datetime.utcnow().isoformat(),
        }

    # =====================================================
    # PASS RATE PIE CHART
    # =====================================================

    @staticmethod
    async def pass_rate():

        attempts = await QuizAttempt.find_all().to_list()

        passed = len([attempt for attempt in attempts if attempt.passed])
        failed = len(attempts) - passed

        percentage = (
            round((passed / len(attempts)) * 100, 2)
            if attempts
            else 0
        )

        return {
            "passed": passed,
            "failed": failed,
            "percentage": percentage,
        }

    # =====================================================
    # DEPARTMENT PERFORMANCE BAR CHART
    # =====================================================

    @staticmethod
    async def department_performance():

        users = await User.find(User.is_active == True).to_list()

        analytics = defaultdict(
            lambda: {
                "users": 0,
                "attempts": 0,
                "scores": [],
            }
        )

        for user in users:

            attempts = await QuizAttempt.find(
                QuizAttempt.user.id == user.id
            ).to_list()

            analytics[user.department]["users"] += 1
            analytics[user.department]["attempts"] += len(attempts)

            analytics[user.department]["scores"].extend(
                [attempt.percentage for attempt in attempts]
            )

        response = []

        for department, value in analytics.items():

            average = (
                round(mean(value["scores"]), 2)
                if value["scores"]
                else 0
            )

            response.append(
                {
                    "department": department,
                    "average_score": average,
                    "users": value["users"],
                    "attempts": value["attempts"],
                }
            )

        response.sort(
            key=lambda item: item["average_score"],
            reverse=True,
        )

        return response

    # =====================================================
    # WEEKLY SCORE TREND
    # =====================================================

    @staticmethod
    async def average_scores():

        today = datetime.utcnow()

        graph = []

        for i in range(5, -1, -1):

            start = today - timedelta(days=(i + 1) * 7)
            end = today - timedelta(days=i * 7)

            attempts = await QuizAttempt.find(
                QuizAttempt.completed_at >= start,
                QuizAttempt.completed_at <= end,
            ).to_list()

            average = (
                round(
                    mean([attempt.percentage for attempt in attempts]),
                    2,
                )
                if attempts
                else 0
            )

            graph.append(
                {
                    "week": f"Week {6 - i}",
                    "score": average,
                }
            )

        return graph

    # =====================================================
    # TOP PERFORMERS
    # =====================================================

    @staticmethod
    async def top_performers(limit: int = 10):

        users = await User.find(User.is_active == True).to_list()

        leaderboard = []

        for user in users:

            attempts = await QuizAttempt.find(
                QuizAttempt.user.id == user.id
            ).to_list()

            scores = [attempt.percentage for attempt in attempts]

            average = round(mean(scores), 2) if scores else 0

            leaderboard.append(
                {
                    "user": user,
                    "average_score": average,
                    "quizzes_completed": len(attempts),
                }
            )

        leaderboard.sort(
            key=lambda item: (
                item["average_score"],
                item["user"].xp.total_xp,
            ),
            reverse=True,
        )

        response = []

        for index, item in enumerate(leaderboard[:limit]):

            response.append(
                {
                    "rank": index + 1,
                    "user_id": str(item["user"].id),
                    "full_name": item["user"].full_name,
                    "department": item["user"].department,
                    "xp": item["user"].xp.total_xp,
                    "average_score": item["average_score"],
                    "quizzes_completed": item["quizzes_completed"],
                }
            )

        return response

    # =====================================================
    # WEAK TOPIC DETECTION
    # =====================================================

    @staticmethod
    async def weak_topics():

        questions = await Question.find_all().to_list()

        topic_scores = defaultdict(list)
        topic_attempts = defaultdict(int)
        topic_difficulty = {}

        for question in questions:
            topic_difficulty[question.topic.value] = question.difficulty.value

        attempts = await QuizAttempt.find_all().to_list()

        for attempt in attempts:
            for answer in attempt.answers:

                topic_scores[answer.topic].append(
                    100 if answer.is_correct else 0
                )

                topic_attempts[answer.topic] += 1

        response = []

        for topic, scores in topic_scores.items():

            response.append(
                {
                    "topic": topic,
                    "average_score": round(mean(scores), 2),
                    "attempts": topic_attempts[topic],
                    "difficulty": topic_difficulty.get(topic, "medium"),
                }
            )

        response.sort(key=lambda item: item["average_score"])

        return response

    # =====================================================
    # EMPLOYEE QUIZ HISTORY
    # =====================================================

    @staticmethod
    async def employee_history(current_user: User):

        attempts = (
            await QuizAttempt.find(
                QuizAttempt.user.id == current_user.id
            )
            .sort([("completed_at", 1)])
            .to_list()
        )

        history = []

        for attempt in attempts:

            await attempt.fetch_link(QuizAttempt.quiz)

            history.append(
                {
                    "date": attempt.completed_at.strftime("%d %b"),
                    "score": attempt.percentage,
                    "quiz_title": attempt.quiz.title,
                }
            )

        return history

    # =====================================================
    # EMPLOYEE TOPIC STRENGTHS
    # =====================================================

    @staticmethod
    async def employee_topic_scores(current_user: User):

        attempts = await QuizAttempt.find(
            QuizAttempt.user.id == current_user.id
        ).to_list()

        topic_map = defaultdict(list)

        for attempt in attempts:
            for answer in attempt.answers:
                topic_map[answer.topic].append(
                    100 if answer.is_correct else 0
                )

        response = []

        for topic, scores in topic_map.items():

            response.append(
                {
                    "topic": topic,
                    "score": round(mean(scores), 2),
                }
            )

        response.sort(key=lambda item: item["score"], reverse=True)

        return response

    # =====================================================
    # EMPLOYEE PERFORMANCE SUMMARY
    # =====================================================

    @staticmethod
    async def employee_performance(current_user: User):

        attempts = await QuizAttempt.find(
            QuizAttempt.user.id == current_user.id
        ).to_list()

        certificates = await Certificate.find(
            Certificate.user.id == current_user.id
        ).count()

        scores = [attempt.percentage for attempt in attempts]

        average = round(mean(scores), 2) if scores else 0

        passed = len([attempt for attempt in attempts if attempt.passed])

        pass_rate = (
            round((passed / len(attempts)) * 100, 2)
            if attempts
            else 0
        )

        return {
            "average_score": average,
            "quizzes_completed": len(attempts),
            "pass_rate": pass_rate,
            "certificates": certificates,
            "xp": current_user.xp.total_xp,
            "current_level": current_user.xp.current_level,
            "awareness_score": current_user.awareness_score,
        }

    # =====================================================
    # WEEKLY ATTEMPTS GRAPH
    # =====================================================

    @staticmethod
    async def history():

        today = datetime.utcnow()

        graph = []

        for i in range(6, -1, -1):

            day = today - timedelta(days=i)

            attempts = await QuizAttempt.find(
                QuizAttempt.completed_at >= datetime(
                    day.year,
                    day.month,
                    day.day,
                ),
                QuizAttempt.completed_at < datetime(
                    day.year,
                    day.month,
                    day.day,
                ) + timedelta(days=1),
            ).to_list()

            average = (
                round(
                    mean([attempt.percentage for attempt in attempts]),
                    2,
                )
                if attempts
                else 0
            )

            graph.append(
                {
                    "day": day.strftime("%a"),
                    "attempts": len(attempts),
                    "average_score": average,
                }
            )

        return graph

    # =====================================================
    # QUIZ DIFFICULTY ANALYTICS
    # =====================================================

    @staticmethod
    async def difficulty_breakdown():

        quizzes = await Quiz.find(Quiz.is_published == True).to_list()

        analytics = {
            "beginner": 0,
            "intermediate": 0,
            "advanced": 0,
        }

        for quiz in quizzes:
            analytics[quiz.difficulty.value] += 1

        return [
            {
                "difficulty": key,
                "count": value,
            }
            for key, value in analytics.items()
        ]

    # =====================================================
    # QUIZ POPULARITY
    # =====================================================

    @staticmethod
    async def popular_quizzes():

        quizzes = await Quiz.find_all().to_list()

        popularity = []

        for quiz in quizzes:

            attempts = await QuizAttempt.find(
                QuizAttempt.quiz.id == quiz.id
            ).count()

            popularity.append(
                {
                    "quiz": quiz.title,
                    "attempts": attempts,
                    "xp_reward": quiz.xp_reward,
                }
            )

        popularity.sort(
            key=lambda item: item["attempts"],
            reverse=True,
        )

        return popularity

    # =====================================================
    # AI READY RECOMMENDATION DATA
    # =====================================================

    @staticmethod
    async def ai_recommendations(current_user: User):

        topics = await QuizAnalyticsService.employee_topic_scores(current_user)

        weak = [topic for topic in topics if topic["score"] < 70]
        strong = [topic for topic in topics if topic["score"] >= 85]

        return {
            "weak_topics": weak,
            "strong_topics": strong,
            "recommendation": (
                "Complete lessons related to your weak topics first."
                if weak
                else "Great job! Continue advanced cybersecurity modules."
            ),
        }