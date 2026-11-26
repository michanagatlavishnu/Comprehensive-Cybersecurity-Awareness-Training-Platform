from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from app.api.controllers.phishing_controller import (
    PhishingController,
)

router = APIRouter(tags=["Phishing Simulation"])

# ==========================================
# ADMIN
# ==========================================

router.post("/admin/phishing/campaigns")(
    PhishingController.create_campaign
)

router.post("/admin/phishing/preview")(
    PhishingController.preview_email
)

router.post("/admin/phishing/launch")(
    PhishingController.launch_campaign
)

router.post("/admin/phishing/schedule")(
    PhishingController.schedule_campaign
)

router.get("/admin/phishing/analytics")(
    PhishingController.analytics
)

# ==========================================
# EMPLOYEE
# ==========================================

router.get("/phishing/inbox")(
    PhishingController.inbox
)

router.post("/phishing/simulation/start")(
    PhishingController.start_simulation
)

router.get("/phishing/simulation/summary")(
    PhishingController.simulation_summary
)

router.get("/phishing/history")(
    PhishingController.history
)

router.get("/phishing/open/{token}")(
    PhishingController.open_email
)

router.get("/phishing/click/{token}")(
    PhishingController.click_email
)

router.post("/phishing/report/{token}")(
    PhishingController.report_email
)

router.post("/phishing/decision/{token}")(
    PhishingController.decide_email
)

router.post("/phishing/credentials")(
    PhishingController.submit_credentials
)

router.get(
    "/phishing/login/{token}",
    response_class=HTMLResponse,
)(
    PhishingController.landing_page
)


# ==========================================
# ADMIN ANALYTICS
# ==========================================

router.get(
    "/admin/phishing/scheduler",
    summary="Scheduler Health",
)(
    PhishingController.scheduler_health
)

router.get(
    "/admin/phishing/heatmap",
    summary="Department Heatmap",
)(
    PhishingController.department_heatmap
)

router.get(
    "/admin/phishing/weak-topics",
    summary="Weak Topics Analytics",
)(
    PhishingController.weak_topics
)

router.get(
    "/admin/phishing/reports",
    summary="Organization Reports",
)(
    PhishingController.organization_report
)