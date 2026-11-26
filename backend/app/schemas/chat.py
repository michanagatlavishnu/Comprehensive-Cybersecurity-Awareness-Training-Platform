from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field


# ==========================================
# Send Chat Message
# ==========================================

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=2)

    conversation_id: Optional[str] = None

    module_context: Optional[str] = None

    language: str = "en"


# ==========================================
# Chat Response
# ==========================================

class ChatResponse(BaseModel):
    conversation_id: str

    title: str

    user_message: str

    assistant_message: str

    model: str

    tokens_used: int

    response_time_ms: int

    language: str


# ==========================================
# Conversation Preview
# ==========================================

class ConversationPreview(BaseModel):
    conversation_id: str

    title: str

    last_message: str

    updated_at: datetime


# ==========================================
# Chat History Message
# ==========================================

class ChatHistoryMessage(BaseModel):
    role: str

    message: str

    language: str

    created_at: datetime


# ==========================================
# Conversation History
# ==========================================

class ConversationHistory(BaseModel):
    conversation_id: str

    title: str

    messages: List[ChatHistoryMessage]


# ==========================================
# Phishing Analyzer
# ==========================================

class PhishingAnalysisRequest(BaseModel):
    email_subject: str

    email_sender: str

    email_content: str

    language: str = "en"


# ==========================================
# Security Tips
# ==========================================

class SecurityTipsRequest(BaseModel):
    topic: str

    language: str = "en"