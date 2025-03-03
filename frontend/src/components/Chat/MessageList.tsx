import useWebSocketStore, { Message } from "@/stores/useWebSocketStore";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useRef, useState } from "react";

const MessageList = () => {
  const messages = useWebSocketStore((state) => state.messages);
  const loading = useWebSocketStore((state) => state.loading);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get only alerts if user hasn't interacted yet
  const userAlerts = !hasUserInteracted
    ? messages.filter((msg) => msg.type === "alert")
    : [];

  // Get all messages if user has interacted
  const chatMessages = hasUserInteracted ? messages : [];

  // Check if user has sent any messages
  useEffect(() => {
    const userMessages = messages.filter(
      (msg) => msg.type === "chat" && msg.sender === "user"
    );
    if (userMessages.length > 0 && !hasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [messages, hasUserInteracted]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (msg: Message, index: number) => {
    if (msg.type === "alert") {
      return (
        <div key={index} className="flex justify-center my-2">
          <div className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-gray-800 dark:text-gray-100 text-xs font-medium">
            <span className="font-semibold">{msg.username}</span>
            {msg.action === "login" ? " joined" : " left"}
            <span className="ml-1 text-teal-600 dark:text-gray-200">
              {msg.timestamp}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className={`p-3 rounded-lg max-w-[80%] ${
            msg.sender === "user"
              ? "bg-teal-600 text-white ml-auto dark:bg-teal-600"
              : "bg-teal-200 text-teal-900 mr-auto dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          <div className="mb-1">{msg.message}</div>
          <div
            className={`text-xs mt-1 text-right ${
              msg.sender === "user"
                ? "text-teal-200 dark:text-teal-100"
                : "text-teal-700 dark:text-gray-400"
            }`}
          >
            {msg.timestamp}
          </div>
        </div>
      );
    }
  };

  return (
    <ScrollArea.Root className="flex-1 w-full overflow-hidden">
      <ScrollArea.Viewport className="w-full h-full">
        <div className="p-4 space-y-4 pb-24">
          {!hasUserInteracted && (
            <div className="text-center text-teal-600 py-8 dark:text-gray-300">
              <div className="mx-auto rounded-xl p-5 mb-6 max-w-md">
                <p className="text-2xl font-semibold mb-3">
                  Welcome to AI Chat!
                </p>
                <p className="text-lg text-teal-600 dark:text-gray-300">
                  Start a conversation by sending a message below.
                </p>
              </div>

              {userAlerts.length > 0 && (
                <div className="space-y-2 mt-4">
                  {userAlerts.map((msg, i) => renderMessage(msg, i))}
                </div>
              )}
            </div>
          )}

          {chatMessages.map((msg, i) => renderMessage(msg, i))}

          {loading && (
            <div className="flex mt-4">
              <div className="flex items-center space-x-1 p-3 rounded-lg bg-teal-200 text-teal-900 dark:bg-gray-600 dark:text-gray-200 text-sm">
                <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-teal-100 transition-colors duration-150 ease-out hover:bg-teal-200 dark:bg-gray-800 dark:border-gray-700 data-[orientation=vertical]:w-2"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-teal-500 rounded-full relative" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};

export default MessageList;
