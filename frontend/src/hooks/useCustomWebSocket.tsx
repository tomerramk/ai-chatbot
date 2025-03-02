import { useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import useWebSocketStore from "@/stores/useWebSocketStore";
import { formatTimestamp } from "@/utils/formatTimestamp";

const useCustomWebSocket = () => {
  const socketUrl = useWebSocketStore((state) => state.socketUrl);
  const username = useWebSocketStore((state) => state.username);
  const setUsername = useWebSocketStore((state) => state.setUsername);
  const setUserCount = useWebSocketStore((state) => state.setUserCount);
  const addMessage = useWebSocketStore((state) => state.addMessage);
  const clearMessages = useWebSocketStore((state) => state.clearMessages);

  const { sendJsonMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl);

  // Send login event to the server
  useEffect(() => {
    if (readyState === WebSocket.OPEN && username) {
      sendJsonMessage({ type: "login", session_id: username });
    }
  }, [readyState, username]);

  // Listen for events
  useEffect(() => {
    if (!lastMessage) return;

    const data = JSON.parse(lastMessage.data);
    if (data.type === "login" || data.type === "disconnect") {
      setUserCount(data.count);

      if (data.username !== username) {
        addMessage({
          type: "alert",
          username: data.username,
          action: data.type,
          timestamp: formatTimestamp(data.timestamp),
        });
      }
    }

    if (data.type === "ai_response" && data.message) {
      addMessage({
        type: "chat",
        username: null,
        message: data.message,
        sender: "ai",
        timestamp: formatTimestamp(data.timestamp),
      });
    }
  }, [lastMessage]);

  // Send message
  const sendMessage = useCallback(
    (message: string) => {
      if (readyState === WebSocket.OPEN && username) {
        sendJsonMessage({ type: "chat", session_id: username, message });
      }
    },
    [readyState, sendJsonMessage, username]
  );

  // Send disconnect event
  const disconnect = useCallback(() => {
    const socket = getWebSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendJsonMessage({ type: "disconnect", session_id: username });
      socket.close();
      clearMessages();
      setUsername(null);
    }
  }, [getWebSocket, sendJsonMessage, setUsername, username]);

  return { sendJsonMessage, lastMessage, readyState, sendMessage, disconnect };
};

export default useCustomWebSocket;
