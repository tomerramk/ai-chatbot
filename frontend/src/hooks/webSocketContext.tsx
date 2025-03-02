import { createContext, useContext } from "react";
import useCustomWebSocket from "../hooks/useCustomWebSocket";

export const WebSocketContext = createContext<ReturnType<
  typeof useCustomWebSocket
> | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useCustomWebSocket();

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
