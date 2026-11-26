from app.dependencies.auth import CurrentUser
from app.schemas.chat import ChatRequest
from app.services.chatbot_service import ChatbotService
from app.utils.response.api_response import success_response


class ChatbotController:

    # ==========================================
    # Send Message
    # ==========================================
    @staticmethod
    async def send_chat(
        payload: ChatRequest,
        current_user: CurrentUser,
    ):
        return success_response(
            message="AI response generated successfully.",
            data=await ChatbotService.send_message(
                current_user=current_user,
                message=payload.message,
                language=payload.language,
                conversation_id=payload.conversation_id,
                module_context=payload.module_context,
            ),
        )

    # ==========================================
    # Conversation List
    # ==========================================
    @staticmethod
    async def conversations(
        current_user: CurrentUser,
    ):
        return success_response(
            message="Conversations fetched successfully.",
            data=await ChatbotService.get_conversations(current_user),
        )

    # ==========================================
    # Conversation History
    # ==========================================
    @staticmethod
    async def history(
        conversation_id: str,
        current_user: CurrentUser,
    ):
        return success_response(
            message="Chat history fetched successfully.",
            data=await ChatbotService.get_history(
                current_user,
                conversation_id,
            ),
        )

    # ==========================================
    # Delete Conversation
    # ==========================================
    @staticmethod
    async def clear(
        conversation_id: str,
        current_user: CurrentUser,
    ):
        await ChatbotService.clear_history(
            current_user,
            conversation_id,
        )

        return success_response(
            message="Conversation deleted successfully.",
        )