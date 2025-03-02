import { useRef, useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import useWebSocketStore from "../stores/useWebSocketStore";
import { useWebSocketContext } from "../hooks/webSocketContext";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai" }[]
  >([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userCount = useWebSocketStore((state) => state.userCount);

  const { readyState, disconnect } = useWebSocketContext();

  const connected = readyState === WebSocket.OPEN;

  const navigate = useNavigate();

  useEffect(() => {
    if (readyState !== WebSocket.OPEN) {
      navigate("/");
    }
  }, [readyState]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() && connected) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Here you would send the message via WebSocket
    }
  };

  return (
    <div className="flex flex-col w-full bg-teal-50 text-gray-800">
      <div className="flex items-center align-middle justify-between p-2 bg-bkg bg-teal-100 border-b border-teal-200">
        <div className="flex items-center">
          {userCount > 1 ? (
            <>
              <div className="w-3 h-3 rounded-full mr-2 bg-teal-600 animate-pulse" />
              <span className="font-medium">{`${userCount > 1 ? `${userCount} users using AI Chat` : ``}`}</span>
            </>
          ) : null}
        </div>
        <div className="flex gap-4 font-medium reverse items-center">
          <div className="text-sm text-teal-700">
            {connected ? "Connected" : "Disconnected"}
          </div>
          <button
            className="px-3 py-2 bg-red-400 hover:cursor-pointer text-white text-sm rounded-lg hover:bg-red-500 transition-colors"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      </div>

      <ScrollArea.Root className="flex-1 w-full overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full">
          <div className="p-4 space-y-4 pb-24">
            {/* Added padding at bottom for input form */}
            {messages.length === 0 && (
              <div className="text-center text-teal-600 py-10">
                <p className="text-2xl">Welcome to the chat!</p>
                <p className="text-lg mt-2">
                  Start a conversation by sending a message below.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white ml-auto"
                    : "bg-teal-200 text-teal-900 mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-teal-100 transition-colors duration-150 ease-out hover:bg-teal-200 data-[orientation=vertical]:w-2"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-teal-500 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <Form.Root
        className="p-4 w-full bg-white border-t border-teal-200"
        onSubmit={handleSubmit}
      >
        <div className="flex max-w-2xl mx-auto">
          <Form.Field className="flex-1" name="message">
            <Form.Control asChild>
              <input
                className="w-full p-3 rounded-l-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              disabled={!connected || !input.trim()}
            >
              Send
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};

export default ChatPage;
