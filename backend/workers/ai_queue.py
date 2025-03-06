import asyncio
import json
from models import chatbot
from utils.time_utils import get_timestamp
from logs.logger import logger

message_queue = asyncio.Queue()

session_histories: dict[str, list[tuple[str, str]]] = {}

async def process_queue():
    """Worker task to handle AI responses sequentially."""
    while True:
        session_id, websocket, message, personality = await message_queue.get()

        try:
            history: list[tuple[str, str]] = session_histories.get(session_id, [])

            response, updated_history = await asyncio.to_thread(chatbot.generate_response, message, conversation_history=history, persona=personality)

            session_histories[session_id] = updated_history

            response_data: dict[str, str] = {
                "type": "ai_response",
                "message": response,
                "timestamp": get_timestamp(),
            }
            
            await websocket.send(json.dumps(response_data))
            logger.info(f"Server sent to {session_id}: {json.dumps(response_data)}")

        except Exception as e:
            error_data: dict[str, str] = {
                "type": "error",
                "message": "An error occurred while processing your request.",
                "timestamp": get_timestamp(),
            }
            await websocket.send(json.dumps(error_data))
            logger.error(f"Error processing AI response: {session_id}: {str(e)}")

        finally:
            message_queue.task_done()
