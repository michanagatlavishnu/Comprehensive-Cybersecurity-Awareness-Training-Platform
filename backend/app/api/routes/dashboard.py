from fastapi import APIRouter

from app.api.controllers.dashboard_controller import DashboardController

router = APIRouter(
    tags=["Dashboard"],
)

# ==========================================
# EMPLOYEE DASHBOARD
# ==========================================

router.add_api_route(
    "/dashboard",
    DashboardController.employee_dashboard,
    methods=["GET"],
    summary="Employee Dashboard",
)

router.add_api_route(
    "/dashboard/activity",
    DashboardController.weekly_activity,
    methods=["GET"],
    summary="Weekly Activity",
)

router.add_api_route(
    "/dashboard/progress",
    DashboardController.learning_progress,
    methods=["GET"],
    summary="Learning Progress",
)

router.add_api_route(
    "/dashboard/xp-history",
    DashboardController.xp_history,
    methods=["GET"],
    summary="XP History",
)

# ==========================================
# ADMIN DASHBOARD
# ==========================================

router.add_api_route(
    "/admin/dashboard",
    DashboardController.admin_dashboard,
    methods=["GET"],
    summary="Admin Dashboard",
)

router.add_api_route(
    "/admin/dashboard/awareness-distribution",
    DashboardController.awareness_distribution,
    methods=["GET"],
    summary="Awareness Distribution",
)

router.add_api_route(
    "/admin/dashboard/departments",
    DashboardController.department_analytics,
    methods=["GET"],
    summary="Department Analytics",
)

router.add_api_route(
    "/admin/dashboard/security-metrics",
    DashboardController.security_metrics,
    methods=["GET"],
    summary="Security Metrics",
)

router.add_api_route(
    "/admin/dashboard/weekly-trend",
    DashboardController.weekly_trend,
    methods=["GET"],
    summary="Weekly Trend",
)

router.add_api_route(
    "/dashboard/activity/record",
    DashboardController.record_activity,
    methods=["POST"],
    summary="Record Learning Activity",
)