from datetime import datetime
from typing import List

from pydantic import BaseModel


class CampaignAnalytics(BaseModel):
    campaign_id: str
    title: str

    total_targets: int
    sent: int
    opened: int
    clicked: int
    reported: int

    click_rate: float
    report_rate: float

    created_at: datetime


class EmployeeRisk(BaseModel):
    user_id: str
    full_name: str
    department: str

    campaigns_received: int
    clicked: int
    reported: int

    phishing_risk_score: float


class DepartmentRisk(BaseModel):
    department: str
    users: int

    click_rate: float
    report_rate: float


class CampaignDashboard(BaseModel):
    campaigns: List[CampaignAnalytics]
    departments: List[DepartmentRisk]
    high_risk_users: List[EmployeeRisk]