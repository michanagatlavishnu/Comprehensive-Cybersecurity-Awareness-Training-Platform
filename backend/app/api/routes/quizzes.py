from fastapi import APIRouter

from app.api.controllers.quiz_controller import QuizController


router = APIRouter(tags=["Quiz Management"])

# ==========================================
# ADMIN QUIZ CRUD
# ==========================================

router.post("/admin/quizzes")(QuizController.create_quiz)

router.get("/admin/quizzes")(QuizController.list_quizzes)

router.get("/admin/modules/{module_id}/quizzes")(QuizController.module_quizzes)

router.put("/admin/quizzes/{quiz_id}")(QuizController.update_quiz)

router.patch("/admin/quizzes/{quiz_id}/publish")(QuizController.publish_quiz)

router.delete("/admin/quizzes/{quiz_id}")(QuizController.delete_quiz)

# ==========================================
# QUESTIONS CRUD
# ==========================================

router.post("/admin/quizzes/{quiz_id}/questions")(QuizController.add_question)

router.get("/admin/quizzes/{quiz_id}/questions")(QuizController.list_questions)

router.put("/admin/questions/{question_id}")(QuizController.update_question)

router.delete("/admin/questions/{question_id}")(QuizController.delete_question)
router.patch(
    "/admin/quizzes/{quiz_id}/publish"
)(QuizController.publish_quiz)
# ==========================================
# AI QUIZ GENERATION
# ==========================================

router.post(
    "/admin/modules/{module_id}/generate-ai-quiz"
)(QuizController.generate_ai_quiz)

router.post(
    "/admin/quizzes/{quiz_id}/regenerate"
)(QuizController.regenerate_ai_questions)

# ==========================================
# EMPLOYEE QUIZ
# ==========================================

router.get(
    "/lessons/{lesson_id}/quiz",
    summary="Get Employee Lesson Quiz",
)(QuizController.lesson_quiz)

router.get(
    "/modules/{module_id}/quiz",
    summary="Get Employee Module Quiz",
)(QuizController.module_quiz)

router.get("/quizzes/{quiz_id}/take")(QuizController.take_quiz)

router.post("/quizzes/{quiz_id}/submit")(QuizController.submit_quiz)

router.get("/quizzes/history")(QuizController.quiz_history)

# ==========================================
# ANALYTICS
# ==========================================

router.get("/admin/quizzes/analytics")(QuizController.quiz_analytics)

router.get("/admin/quizzes/top-performers")(QuizController.top_performers)

router.get("/admin/quizzes/weak-topics")(QuizController.weak_topics)

router.get("/admin/quizzes/department-analytics")(QuizController.department_analytics)

# Generate quiz directly from a lesson
router.post(
    "/admin/lessons/{lesson_id}/generate-ai-quiz"
)(QuizController.generate_ai_quiz_from_lesson)