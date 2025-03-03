import { useWebSocketContext } from "@/hooks/webSocketContext";
import useWebSocketStore from "@/stores/useWebSocketStore";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";

const MessageInput = () => {
  const username = useWebSocketStore((state) => state.username);
  const addMessage = useWebSocketStore((state) => state.addMessage);
  const loading = useWebSocketStore((state) => state.loading);

  const { readyState, sendMessage } = useWebSocketContext();

  const [input, setInput] = useState("");

  const connected = readyState === WebSocket.OPEN;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() && connected) {
      addMessage({
        type: "chat",
        username: username,
        message: input,
        sender: "user",
        timestamp:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
      });
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <Form.Root
      className="fixed bottom-0 p-3 w-full bg-white border-t border-teal-200 dark:bg-gray-800 dark:border-gray-700"
      onSubmit={handleSubmit}
    >
      <div className="flex max-w-2xl mx-auto">
        <Form.Field className="flex-1" name="message">
          <Form.Control asChild>
            <input
              className="w-full p-3 rounded-l-lg border border-teal-300 focus:ring-2 focus:outline-none focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-400"
              placeholder="Ask Anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!connected}
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button
            className="px-6 py-3 hover:cursor-pointer bg-teal-600 text-white rounded-r-lg font-medium hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!connected || !input.trim() || loading}
          >
            Send
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
};

export default MessageInput;
