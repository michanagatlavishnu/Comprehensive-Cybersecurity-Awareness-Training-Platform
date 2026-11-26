from datetime import datetime

from beanie import PydanticObjectId

from app.core.exceptions import (
    BadRequestException,
    NotFoundException,
)

from app.models.question import Question
from app.models.quiz import Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.user import User

from app.services.notification_service import NotificationService
from app.services.xp_manager import XPManager
class QuizAttemptService:

    # ==========================================
    # START QUIZ
    # ==========================================

    @staticmethod
    async def start_quiz(
        quiz_id: str,
        current_user: User,
    ):

        quiz = await Quiz.get(PydanticObjectId(quiz_id))

        if not quiz:
            raise NotFoundException("Quiz not found.")

        if not quiz.is_published:
            raise BadRequestException("Quiz is not published.")

        await quiz.fetch_link(Quiz.module)

        questions = await Question.find(
            Question.quiz.id == quiz.id
        ).sort("order").to_list()

        attempt = QuizAttempt(
            user=current_user,
            quiz=quiz,
        )

        await attempt.insert()

        return {
            "attempt_id": str(attempt.id),
            "quiz": {
                "id": str(quiz.id),
                "title": quiz.title,
                "module": quiz.module.title,
                "time_limit_minutes": quiz.time_limit_minutes,
                "passing_score": quiz.passing_score,
            },
            "questions": [
                {
                    "id": str(question.id),
                    "title": question.title,
                    "question_type": question.question_type,
                    "order": question.order,
                    "points": question.points,
                    "options": [
                        option.text
                        for option in question.options
                    ],
                }
                for question in questions
            ],
        }

    # ==========================================
    # SUBMIT QUIZ
    # ==========================================

    @staticmethod
    async def submit_quiz(
        attempt_id: str,
        payload,
        current_user: User,
    ):

        attempt = await QuizAttempt.get(
            PydanticObjectId(attempt_id)
        )

        if not attempt:
            raise NotFoundException("Quiz attempt not found.")

        await attempt.fetch_link(QuizAttempt.quiz)

        quiz = attempt.quiz

        score = 0
        max_score = 0
        answers_dict = {}
        review = []

        for answer in payload.answers:

            question = await Question.get(
                PydanticObjectId(answer.question_id)
            )

            if not question:
                continue

            correct = [
                index
                for index, option in enumerate(question.options)
                if option.is_correct
            ]

            selected = sorted(answer.selected_answers)

            answers_dict[str(question.id)] = selected

            max_score += question.points

            is_correct = selected == sorted(correct)

            if is_correct:
                score += question.points

            review.append({
                "question": question.title,
                "selected_answers": selected,
                "correct_answers": correct,
                "correct": is_correct,
                "points": question.points if is_correct else 0,
            })

        percentage = round((score / max_score) * 100, 2) if max_score else 0

        passed = percentage >= quiz.passing_score

        attempt.answers = answers_dict
        attempt.score = score
        attempt.percentage = percentage
        attempt.passed = passed
        attempt.completed_at = datetime.utcnow()
        attempt.submitted_at = datetime.utcnow()

        # --------------------------------------
        # XP Reward (Only First Pass)
        # --------------------------------------

        earned_xp = 0

        if passed:

            previous_pass = await QuizAttempt.find_one(
                QuizAttempt.user.id == current_user.id,
                QuizAttempt.quiz.id == quiz.id,
                QuizAttempt.passed == True,
            )

            if previous_pass is None:

                earned_xp = quiz.xp_reward

                attempt.is_first_pass = True
                attempt.earned_xp = earned_xp

                current_user.xp.completed_quizzes += 1

                await current_user.save()

                await XPManager.award_xp(
                    current_user,
                    earned_xp,
                )

                await XPManager.award_awareness_score(
                    current_user,
                    percentage,
                )

                await NotificationService.create_notification(
                    user=current_user,
                    title="Quiz Passed 🎉",
                    message=f"You passed '{quiz.title}' and earned {earned_xp} XP!",
                    notification_type="success",
                )

        else:

            await NotificationService.create_notification(
                user=current_user,
                title="Quiz Failed",
                message=f"You scored {percentage}% in '{quiz.title}'. Try again!",
                notification_type="warning",
            )

        await attempt.save()

        return {
            "attempt_id": str(attempt.id),
            "score": score,
            "max_score": max_score,
            "percentage": percentage,
            "passed": passed,
            "earned_xp": earned_xp,
            "current_xp": current_user.xp.total_xp,
            "current_level": current_user.xp.current_level,
            "awareness_score": current_user.awareness_score,
            "review": review,
        }

    # ==========================================
    # QUIZ HISTORY
    # ==========================================

    @staticmethod
    async def history(current_user: User):

        attempts = await QuizAttempt.find(
            QuizAttempt.user.id == current_user.id
        ).sort("-submitted_at").to_list()

        history = []

        for attempt in attempts:
            await attempt.fetch_link(QuizAttempt.quiz)

            history.append({
                "attempt_id": str(attempt.id),
                "quiz": attempt.quiz.title,
                "score": attempt.score,
                "percentage": attempt.percentage,
                "passed": attempt.passed,
                "submitted_at": attempt.submitted_at,
            })

        return history