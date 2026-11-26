from app.dependencies.auth import CurrentUser

from app.schemas.quiz_attempt import SubmitQuizRequest

from app.services.quiz_attempt_service import QuizAttemptService

from app.utils.response.api_response import success_response


class QuizAttemptController:

    @staticmethod
    async def start_quiz(
        quiz_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Quiz started successfully.",
            data=await QuizAttemptService.start_quiz(
                quiz_id,
                current_user,
            ),
        )

    @staticmethod
    async def submit_quiz(
        attempt_id: str,
        payload: SubmitQuizRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Quiz submitted successfully.",
            data=await QuizAttemptService.submit_quiz(
                attempt_id,
                payload,
                current_user,
            ),
        )

    @staticmethod
    async def history(current_user: CurrentUser):
        return success_response(
            message="Quiz history fetched successfully.",
            data=await QuizAttemptService.history(current_user),
        )