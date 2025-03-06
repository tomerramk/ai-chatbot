import asyncio
import signal
import json
import websockets
from typing import Dict

from dotenv import load_dotenv
load_dotenv()
from workers.ai_queue import message_queue, process_queue, session_histories
from utils.time_utils import get_timestamp
from utils.get_arg_value import get_arg_value
from logs.logger import logger

sessions: Dict[str, websockets.ServerConnection] = {}
personality: str = "default"

shutdown_event = asyncio.Event()

async def handle_client(websocket: websockets.ServerConnection) -> None:
    """
    Handles the connection with a single client. This function manages the entire 
    client lifecycle including receiving messages, processing them, and sending responses.

    1. Receives the session ID and personality from the client.
    2. Checks if the username is valid and not already in use.
    3. Adds the client to the active session list.
    4. Processes incoming chat messages by passing them to the message queue.
    5. Sends responses to the client based on the AI chatbot processing.
    6. Handles disconnections and cleans up the session data.

    Args:
        websocket (websockets.ServerConnection): The WebSocket connection object for the client.
    
    Returns:
        None
    """

    session_id = None

    try:
        data = await websocket.recv()
        init_data = json.loads(data)
        session_id = init_data.get("session_id", None)
        logger.info(f"New client sent: {data}")

        if not session_id:
            logger.error(f"Username wasn't passed")
            await websocket.send(json.dumps({"type": "error", "error": "Username is required"}))
            await websocket.close()
            return

        if session_id in sessions:
            logger.error(f"Username {session_id} already taken")
            await websocket.send(json.dumps({"type": "error", "error": "Username already taken", "timestamp": get_timestamp()}))
            await websocket.close()
            return

        sessions[session_id] = websocket
        personality = init_data.get("personality", "default")
        response_data={"type": "success", "message": "Login successfull", "timestamp": get_timestamp()}

        await websocket.send(json.dumps(response_data))
        logger.info(f"Server sent to {session_id}: {response_data}")

        await broadcast_event("login", session_id)

        while True:
            try:
                message = await websocket.recv()
                logger.info(f"Client {session_id} sent: {message}")

                data=json.loads(message)
                if data.get("type") == "disconnect":
                    break  

                if data.get("type") == "chat":
                    await message_queue.put((session_id, websocket, data["message"], personality)) 

            except (websockets.exceptions.ConnectionClosed, asyncio.CancelledError) as e:
                logger.info(f"Client '{session_id}' disconnected")
                break

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON received from client {e}")

    except Exception as e:
        logger.error(f"Error handling client: {e}")

    finally:
        if session_id:
            if sessions.get(session_id) == websocket:
                del sessions[session_id]

            session_histories.pop(session_id, None)

            await broadcast_event("disconnect", session_id)

async def broadcast_event(event_type: str, username: str) -> None:
    """Broadcasts a user connection/disconnection event along with the updated count."""

    user_count = len(sessions)
    message = json.dumps({
        "type": event_type,
        "username": username,
        "count": user_count,
        "timestamp": get_timestamp(),
    })

    logger.info(f"Broadcast: {message}")

    if sessions:
        await asyncio.gather(*(session.send(message) for session in sessions.values()))

async def main():
    host: str = "localhost"
    port: int = get_arg_value('port', "Enter the port number for the WebSocket server:", "PORT")

    stop_event = asyncio.Event()

    async def shutdown():
        logger.info("Shutting down...")
        stop_event.set()

    # Register signal handlers for SIGINT and SIGTERM
    for sig in [signal.SIGINT, signal.SIGTERM]:
        signal.signal(sig, lambda sig, frame: asyncio.create_task(shutdown(sig)))

    # Start AI processing worker
    asyncio.create_task(process_queue())  

    try:
        async with websockets.serve(handle_client, host, port):
            logger.info(f"WebSocket server listening on ws://{host}:{port}")
            await stop_event.wait()

    except asyncio.CancelledError:
        logger.info("Server interrupted. Shutting down...")

    except Exception as e:
        logger.error(f"Error in the WebSocket server: {e}")

    finally:
        logger.info("Server shutdown complete.")

if __name__ == "__main__":
    asyncio.run(main())
