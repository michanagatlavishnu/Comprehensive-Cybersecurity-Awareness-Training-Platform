import time
import uuid

from app.core.ai.groq_client import GroqClient
from app.core.ai.prompts import SYSTEM_PROMPT
from app.core.config import settings
from app.models.chat_message import ChatMessage, ChatRole
from app.models.user import User
from app.services.localization_service import LocalizationService


class ChatbotService:

    @staticmethod
    async def send_message(
        current_user: User,
        message: str,
        language: str,
        conversation_id: str | None = None,
        module_context: str | None = None,
    ):

        if conversation_id is None:
            conversation_id = str(uuid.uuid4())

        history = (
            await ChatMessage.find(
                ChatMessage.conversation_id == conversation_id
            )
            .sort("created_at")
            .limit(settings.AI_MAX_HISTORY)
            .to_list()
        )

        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            }
        ]

        if module_context:
            messages.append(
                {
                    "role": "system",
                    "content": (
                        f"Employee is currently learning module: {module_context}."
                    ),
                }
            )

        for item in history:
            messages.append(
                {
                    "role": item.role.value,
                    "content": item.message,
                }
            )

        messages.append(
            {
                "role": "user",
                "content": message,
            }
        )

        start = time.time()

        ai_reply = await GroqClient.chat(messages)

        response_time = int((time.time() - start) * 1000)

        tokens = len(message.split()) + len(ai_reply.split())

        title = (
            history[0].conversation_title
            if history and history[0].conversation_title
            else message[:40]
        )

        await ChatMessage(
            user=current_user,
            conversation_id=conversation_id,
            conversation_title=title,
            module_context=module_context,
            role=ChatRole.USER,
            message=message,
            language=language,
            tokens_used=0,
        ).insert()

        await ChatMessage(
            user=current_user,
            conversation_id=conversation_id,
            conversation_title=title,
            module_context=module_context,
            role=ChatRole.ASSISTANT,
            message=ai_reply,
            language=language,
            tokens_used=tokens,
            response_time_ms=response_time,
            model_name=settings.GROQ_MODEL,
        ).insert()

        assistant_response = {
            "conversation_id": conversation_id,
            "title": title,
            "assistant_message": ai_reply,
            "user_message": message,
        }
        
        assistant_response = await LocalizationService.chatbot(
            assistant_response,
            language,
        )
        
        return assistant_response

    @staticmethod
    async def get_conversations(current_user: User):

        chats = (
            await ChatMessage.find(ChatMessage.user.id == current_user.id)
            .sort("-created_at")
            .to_list()
        )

        conversations = {}

        for item in chats:
            cid = item.conversation_id

            if cid not in conversations:
                conversations[cid] = {
                    "conversation_id": cid,
                    "title": item.conversation_title or "New Conversation",
                    "last_message": item.message,
                    "updated_at": item.created_at,
                }

        return list(conversations.values())

    @staticmethod
    async def get_history(current_user: User, conversation_id: str):

        chats = (
            await ChatMessage.find(
                ChatMessage.user.id == current_user.id,
                ChatMessage.conversation_id == conversation_id,
            )
            .sort("created_at")
            .to_list()
        )

        if not chats:
            return {
                "conversation_id": conversation_id,
                "title": "Conversation",
                "messages": [],
            }

        return {
            "conversation_id": conversation_id,
            "title": chats[0].conversation_title,
            "messages": [
                {
                    "role": item.role.value,
                    "message": item.message,
                    "language": item.language,
                    "created_at": item.created_at.isoformat(),
                }
                for item in chats
            ],
        }

    @staticmethod
    async def clear_history(current_user: User, conversation_id: str):

        chats = await ChatMessage.find(
            ChatMessage.user.id == current_user.id,
            ChatMessage.conversation_id == conversation_id,
        ).to_list()

        for chat in chats:
            await chat.delete()

        return True