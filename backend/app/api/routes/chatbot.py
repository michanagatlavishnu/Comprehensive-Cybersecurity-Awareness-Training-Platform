from fastapi import APIRouter

from app.api.controllers.chatbot_controller import ChatbotController

router = APIRouter(tags=["AI Chatbot"])

router.post(
    "/chat/send",
    summary="Send Message to CyberAware AI",
)(ChatbotController.send_chat)

router.get(
    "/chat/conversations",
    summary="Conversation List",
)(ChatbotController.conversations)

router.get(
    "/chat/history/{conversation_id}",
    summary="Conversation History",
)(ChatbotController.history)

router.delete(
    "/chat/history/{conversation_id}",
    summary="Delete Conversation",
)(ChatbotController.clear)