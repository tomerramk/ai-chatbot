import { useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import useWebSocketStore from "../stores/useWebSocketStore";

const useCustomWebSocket = () => {
  const socketUrl = useWebSocketStore((state) => state.socketUrl);
  const username = useWebSocketStore((state) => state.username);
  const setUsername = useWebSocketStore((state) => state.setUsername);
  const setUserCount = useWebSocketStore((state) => state.setUserCount);

  const { sendJsonMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket(socketUrl);

  /** Send login event to the server */
  useEffect(() => {
    if (readyState === WebSocket.OPEN && username) {
      sendJsonMessage({ session_id: username });
    }
  }, [readyState, username]);

  useEffect(() => {
    if (!lastMessage) return;

    const data = JSON.parse(lastMessage.data);
    if (data.type === "login" || data.type === "disconnect") {
      setUserCount(data.count);
    }
  }, [lastMessage]);

  const disconnect = useCallback(() => {
    const socket = getWebSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendJsonMessage({ type: "disconnect", session_id: username });
      socket.close();
      setUsername(null);
    }
  }, [getWebSocket, sendJsonMessage, setUsername, username]);

  return { sendJsonMessage, lastMessage, readyState, disconnect };
};

export default useCustomWebSocket;
