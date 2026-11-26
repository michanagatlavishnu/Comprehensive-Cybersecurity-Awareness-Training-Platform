from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.core.config import settings

from app.models.user import User
from app.models.otp import OTP
from app.models.badge import Badge
from app.models.achievement import Achievement
from app.models.notification import Notification
from app.models.translation_cache import TranslationCache
from app.models.module import LearningModule
from app.models.training import TrainingModule
from app.models.lesson import Lesson
from app.models.user_progress import UserProgress
from app.models.learning_activity import LearningActivity
from app.models.phishing_campaign import PhishingCampaign
from app.models.phishing_email import PhishingEmail
from app.models.phishing_event import PhishingEvent
from app.models.phishing_template import PhishingTemplate
from app.models.phishing_landing_page import PhishingLandingPage

from app.models.quiz import Quiz
from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_bank import QuizBank
from app.models.quiz_analytics import QuizAnalytics

from app.models.chat_message import ChatMessage
from app.models.certificate import Certificate

client: AsyncMongoClient | None = None


async def connect_to_mongo():
    global client

    client = AsyncMongoClient(settings.MONGODB_URI)

    database = client[settings.DATABASE_NAME]

    await init_beanie(
        database=database,
        document_models=[
            User,
            OTP,
            Badge,
            Achievement,
            Notification,

            LearningModule,
            TrainingModule,
            Lesson,
            UserProgress,
            LearningActivity,

            Quiz,
            Question,
            QuizAttempt,
            QuizBank,
            QuizAnalytics,

            ChatMessage,
            Certificate,
            PhishingCampaign,
            PhishingEmail,
            PhishingEvent,
            PhishingTemplate,
            PhishingLandingPage,
            TranslationCache,
        ],
    )

    print("✅ MongoDB Connected")


async def close_mongo_connection():
    global client

    if client:
        await client.close()
        print("✅ MongoDB Connection Closed")