from fastapi import Depends
from fastapi import Query
from app.dependencies.auth import CurrentAdmin, CurrentUser

from app.schemas.quiz import CreateQuizRequest, UpdateQuizRequest
from app.schemas.question import CreateQuestionRequest, UpdateQuestionRequest
from app.schemas.generated_quiz import (
    GenerateQuizRequest,
    SubmitQuizRequest,
    GeneratedQuizResponse,
)

from app.services.quiz_service import QuizService

from app.utils.response.api_response import success_response


class QuizController:

    # ==========================================
    # QUIZ CRUD
    # ==========================================

    @staticmethod
    async def create_quiz(
        payload: CreateQuizRequest,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Quiz created successfully.",
            data=await QuizService.create_quiz(payload),
        )

    @staticmethod
    async def list_quizzes(
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Quizzes fetched successfully.",
            data=await QuizService.list_quizzes(),
        )

    @staticmethod
    async def module_quizzes(
        module_id: str,
        current_admin: CurrentAdmin,
    ):
        return success_response(
            message="Module quizzes fetched successfully.",
            data=await QuizService.quizzes_by_module(module_id),
        )

    @staticmethod
    async def update_quiz(
        quiz_id: str,
        payload: UpdateQuizRequest,
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Quiz updated successfully.",
            data=await QuizService.update_quiz(quiz_id, payload),
        )

    @staticmethod
    async def publish_quiz(
        quiz_id: str,
        current_admin: CurrentAdmin,
        publish: bool = Query(True),
    ):
        quiz = await QuizService.publish_quiz(
            quiz_id=quiz_id,
            publish=publish,
        )

        return success_response(
            message="Quiz published successfully." if publish else "Quiz unpublished successfully.",
            data=quiz,
        )

    @staticmethod
    async def delete_quiz(
        quiz_id: str,
        current_admin=CurrentAdmin,
    ):
        await QuizService.delete_quiz(quiz_id)

        return success_response(
            message="Quiz deleted successfully.",
        )
        
        
    

    @staticmethod
    async def publish_quiz(
        quiz_id: str,
        current_admin: CurrentAdmin,
        publish: bool = Query(True),
    ):
        quiz = await QuizService.publish_quiz(quiz_id, publish)

        return success_response(
            message=(
                "Quiz published successfully."
                if publish
                else "Quiz unpublished successfully."
            ),
            data=quiz,
        )

    # ==========================================
    # QUESTION CRUD
    # ==========================================

    @staticmethod
    async def add_question(
        quiz_id: str,
        payload: CreateQuestionRequest,
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Question added successfully.",
            data=await QuizService.add_question(quiz_id, payload),
        )

    @staticmethod
    async def list_questions(
        quiz_id: str,
        current_admin=CurrentAdmin,
    ):
        return success_response(
            message="Questions fetched successfully.",
            data=await QuizService.list_questions(quiz_id),
        )

    @staticmethod
    async def update_question(
        question_id: str,
        payload: UpdateQuestionRequest,
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Question updated successfully.",
            data=await QuizService.update_question(question_id, payload),
        )

    @staticmethod
    async def delete_question(
        question_id: str,
        current_admin=CurrentAdmin,
    ):
        await QuizService.delete_question(question_id)

        return success_response(
            message="Question deleted successfully.",
        )

    # ==========================================
    # AI QUIZ GENERATION
    # ==========================================

    @staticmethod
    async def generate_ai_quiz(
        module_id: str,
        payload: GenerateQuizRequest,
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="AI quiz generated successfully.",
            data=await QuizService.generate_ai_quiz(module_id, payload),
        )

    @staticmethod
    async def regenerate_ai_questions(
        quiz_id: str,
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="AI questions regenerated successfully.",
            data=await QuizService.regenerate_ai_questions(quiz_id),
        )

    # ==========================================
    # EMPLOYEE QUIZ
    # ==========================================

    @staticmethod
    async def lesson_quiz(
        lesson_id: str,
        current_user=CurrentUser,
    ):
        return success_response(
            message="Lesson quiz fetched successfully.",
            data=await QuizService.lesson_quiz(lesson_id, current_user),
        )

    @staticmethod
    async def module_quiz(
        module_id: str,
        current_user=CurrentUser,
    ):
        return success_response(
            message="Module quiz fetched successfully.",
            data=await QuizService.module_quiz(module_id, current_user),
        )

    @staticmethod
    async def take_quiz(
        quiz_id: str,
        current_user=CurrentUser,
    ):
        return success_response(
            message="Quiz loaded successfully.",
            data=await QuizService.take_quiz(quiz_id, current_user),
        )

    @staticmethod
    async def submit_quiz(
        quiz_id: str,
        payload: SubmitQuizRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Quiz submitted successfully.",
            data=await QuizService.submit_quiz(
                quiz_id,
                payload,
                current_user,
            ),
        )

    @staticmethod
    async def quiz_history(
        current_user: CurrentUser,
    ):
        return success_response(
            message="Quiz history fetched successfully.",
            data=await QuizService.quiz_history(current_user),
        )

    # ==========================================
    # ADMIN ANALYTICS
    # ==========================================

    @staticmethod
    async def quiz_analytics(
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Quiz analytics fetched successfully.",
            data=await QuizService.quiz_analytics(),
        )

    @staticmethod
    async def top_performers(
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Top performers fetched successfully.",
            data=await QuizService.top_performers(),
        )

    @staticmethod
    async def weak_topics(
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Weak topics fetched successfully.",
            data=await QuizService.weak_topics(),
        )

    @staticmethod
    async def department_analytics(
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="Department analytics fetched successfully.",
            data=await QuizService.department_quiz_analytics(),
        )
        
        
    @staticmethod
    async def generate_ai_quiz_from_lesson(
        lesson_id: str,
        payload: GenerateQuizRequest,
        current_admin=Depends(CurrentAdmin),
    ):
        return success_response(
            message="AI quiz generated successfully.",
            data=await QuizService.generate_ai_quiz_from_lesson(
                lesson_id,
                payload,
            ),
        )