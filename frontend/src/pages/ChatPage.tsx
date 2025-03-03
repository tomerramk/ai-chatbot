import { useRef, useEffect } from "react";
import useWebSocketStore from "@stores/useWebSocketStore";
import { useWebSocketContext } from "@/hooks/webSocketContext";
import { useNavigate } from "react-router-dom";
import MessageInput from "@/components/Chat/MessageInput";
import Header from "@/components/Chat/ChatHeader";
import MessageList from "@/components/Chat/MessageList";

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useWebSocketStore((state) => state.messages);
  const clearMessages = useWebSocketStore((state) => state.clearMessages);

  const { readyState } = useWebSocketContext();

  const navigate = useNavigate();

  // Redirect to Login page on socket disconnect
  useEffect(() => {
    if (readyState !== WebSocket.OPEN) {
      navigate("/");
      clearMessages();
    }
  }, [readyState, navigate]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full bg-teal-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <Header />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatPage;
