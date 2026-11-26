from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field


# ==========================================================
# CREATE CAMPAIGN
# ==========================================================

class CreatePhishingCampaignRequest(BaseModel):
    campaign_name: str = Field(..., min_length=3)
    topic: str = Field(..., min_length=3)

    department: str = "All"

    template_name: str = "gmail"

    difficulty: str = "medium"

    language: str = "en"

    scheduled_at: Optional[datetime] = None


# ==========================================================
# PREVIEW REQUEST
# ==========================================================

class GeneratePhishingPreviewRequest(BaseModel):
    topic: str

    department: str

    template_name: str = "gmail"

    difficulty: str = "medium"

    language: str = "en"


# ==========================================================
# LAUNCH CAMPAIGN
# ==========================================================

class LaunchCampaignRequest(BaseModel):
    campaign_id: str


# ==========================================================
# CREDENTIAL SUBMISSION
# ==========================================================

class CredentialSubmissionRequest(BaseModel):
    tracking_token: str

    username: str

    password: str


class PhishingDecisionRequest(BaseModel):
    is_phishing: bool


# ==========================================================
# PREVIEW RESPONSE
# ==========================================================

class PhishingPreviewResponse(BaseModel):
    subject: str

    sender_name: str

    sender_email: str

    html_body: str

    language: str


# ==========================================================
# CAMPAIGN RESPONSE
# ==========================================================

class CampaignResponse(BaseModel):
    id: str

    title: str

    department: str

    language: str

    difficulty: str

    status: str

    created_at: str


# ==========================================================
# EMAIL INBOX RESPONSE
# ==========================================================

class InboxEmail(BaseModel):
    id: str

    subject: str

    sender_name: str

    sender_email: str

    opened: bool

    clicked: bool

    reported: bool

    credentials_submitted: bool

    language: str

    sent_at: str


# ==========================================================
# ANALYTICS RESPONSE
# ==========================================================

class CampaignAnalytics(BaseModel):
    campaign_id: str

    campaign: str

    department: str

    language: str

    targets: int

    opened: int

    clicked: int

    reported: int

    credentials_submitted: int

    open_rate: float

    click_rate: float

    report_rate: float

    credential_rate: float

    created_at: str
    



# ==========================================================
# SCHEDULE CAMPAIGN
# ==========================================================

class ScheduleCampaignRequest(BaseModel):
    campaign_id: str
    scheduled_at: datetime


# ==========================================================
# TRACKING RESPONSE
# ==========================================================

class TrackingResponse(BaseModel):
    success: bool
    event: str
    timestamp: str


# ==========================================================
# EMPLOYEE HISTORY RESPONSE
# ==========================================================

class EmployeeHistoryResponse(BaseModel):
    campaign: str
    subject: str
    opened: bool
    clicked: bool
    reported: bool
    credentials_submitted: bool
    sent_at: str