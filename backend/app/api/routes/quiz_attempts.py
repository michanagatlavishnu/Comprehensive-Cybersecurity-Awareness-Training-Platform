from fastapi import APIRouter

from app.api.controllers.quiz_attempt_controller import QuizAttemptController

router = APIRouter(tags=["Employee Quiz"])

router.post(
    "/quizzes/{quiz_id}/start",
    summary="Start Quiz",
)(QuizAttemptController.start_quiz)

router.post(
    "/quiz-attempts/{attempt_id}/submit",
    summary="Submit Quiz",
)(QuizAttemptController.submit_quiz)

router.get(
    "/quiz-attempts/history",
    summary="Quiz History",
)(QuizAttemptController.history)