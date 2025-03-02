import asyncio
import json
import websockets
from models import chatbot
from config import PERSONALITIES
from logger import logger

sessions = {}

async def handle_client(websocket):
    session_id = None  # Track the username for this session

    try:
        # Receive initial data (username)
        data = await websocket.recv()
        init_data = json.loads(data)
        session_id = init_data.get("session_id", None)

        if not session_id:
            logger.error(f"Username wasn't passed")
            await websocket.send(json.dumps({"type": "error", "error": "Username is required"}))
            await websocket.close()
            return

        # Check if the username is already in use
        if session_id in sessions:
            logger.error(f"Username {session_id} already taken")
            await websocket.send(json.dumps({"type": "error", "error": "Username already taken"}))
            await websocket.close()
            return

        # Add username to sessions
        sessions[session_id] = websocket
        await websocket.send(json.dumps({"type": "success", "message": "Login successfull"}))
        logger.info(f"User '{session_id}' connected.")
        await broadcast_event("login", session_id)

        while True:
            try:
                message = await websocket.recv()
                logger.info(f"Received from {session_id}: {message}")

                # Echo the message back to the client
                await websocket.send(json.dumps({"response": f"You said: {message}"}))

            except (websockets.exceptions.ConnectionClosed, asyncio.CancelledError) as e:
                logger.info(f"User '{session_id}' disconnected:")
                break  # Exit loop when client disconnects

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON received from client. {e}")
    except Exception as e:
        logger.error(f"Error handling client: {e}")
    finally:
        # Remove the user from active users on disconnect
        if session_id and sessions.get(session_id) == websocket:
            del sessions[session_id]
            logger.info(f"User '{session_id}' removed.")
            await broadcast_event("disconnect", session_id)


async def broadcast_event(event_type, username):
    """Broadcasts a user connection/disconnection event along with the updated count."""
    user_count = len(sessions)
    message = json.dumps({
        "type": event_type,
        "username": username,
        "count": user_count
    })

    logger.info(f"Broadcasting event: {event_type} - {username} (Users online: {user_count})")

    if sessions:
        await asyncio.gather(*(session.send(message) for session in sessions.values()))


async def main():
    host, port = "localhost", 8000
    async with websockets.serve(handle_client, host, port):
        logger.info(f"WebSocket server listening on ws://{host}:{port}")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
