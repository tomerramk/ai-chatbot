import asyncio
import json
from models import chatbot
from utils.time_utils import get_timestamp
from logs.logger import logger

# Global AI message queue
message_queue = asyncio.Queue()

async def process_queue():
    """Worker task to handle AI responses sequentially."""
    while True:
        session_id, websocket, message, personality = await message_queue.get()

        try:
            response = await asyncio.to_thread(chatbot.generate_response, message, persona=personality)

            response_data = {
                "type": "ai_response",
                "message": response,
                "timestamp": get_timestamp(),
            }
            
            await websocket.send(json.dumps(response_data))
            logger.info(f"Server sent to {session_id}: {json.dumps(response_data)}")
        except Exception as e:
            logger.error(f"Error processing AI response: {e}")

        message_queue.task_done()
