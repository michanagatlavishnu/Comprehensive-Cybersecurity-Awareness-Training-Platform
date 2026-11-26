from fastapi import APIRouter

from app.api.controllers.quiz_analytics_controller import QuizAnalyticsController

router = APIRouter(tags=["Quiz Analytics"])

# =====================================================
# ADMIN ANALYTICS
# =====================================================

router.get(
    "/admin/analytics/overview",
    summary="Quiz Overview Dashboard",
)(
    QuizAnalyticsController.overview
)

router.get(
    "/admin/analytics/pass-rate",
    summary="Quiz Pass Rate",
)(
    QuizAnalyticsController.pass_rate
)

router.get(
    "/admin/analytics/department-performance",
    summary="Department Performance",
)(
    QuizAnalyticsController.department_performance
)

router.get(
    "/admin/analytics/average-scores",
    summary="Average Quiz Scores",
)(
    QuizAnalyticsController.average_scores
)

router.get(
    "/admin/analytics/top-performers",
    summary="Top Performers",
)(
    QuizAnalyticsController.top_performers
)

router.get(
    "/admin/analytics/weak-topics",
    summary="Weak Topic Detection",
)(
    QuizAnalyticsController.weak_topics
)

router.get(
    "/admin/analytics/difficulty-breakdown",
    summary="Difficulty Breakdown",
)(
    QuizAnalyticsController.difficulty_breakdown
)

router.get(
    "/admin/analytics/popular-quizzes",
    summary="Most Attempted Quizzes",
)(
    QuizAnalyticsController.popular_quizzes
)

router.get(
    "/admin/analytics/history",
    summary="Weekly Quiz Analytics",
)(
    QuizAnalyticsController.weekly_history
)

# =====================================================
# EMPLOYEE ANALYTICS
# =====================================================

router.get(
    "/analytics/my-performance",
    summary="My Quiz Performance",
)(
    QuizAnalyticsController.my_performance
)

router.get(
    "/analytics/my-history",
    summary="My Quiz History",
)(
    QuizAnalyticsController.my_history
)

router.get(
    "/analytics/my-topics",
    summary="My Topic Scores",
)(
    QuizAnalyticsController.my_topics
)

router.get(
    "/analytics/recommendations",
    summary="AI Learning Recommendations",
)(
    QuizAnalyticsController.ai_recommendations
)