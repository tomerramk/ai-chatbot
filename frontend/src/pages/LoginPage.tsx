import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import useWebSocketStore from "@stores/useWebSocketStore";
import { useWebSocketContext } from "@hooks/webSocketContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import SelectItem from "@/components/SelectItem";

const LoginPage = () => {
  const [storedUsername, setStoredUsername] = useLocalStorage("username");
  const [port, setPort] = useLocalStorage("port");

  const navigate = useNavigate();

  const username = useWebSocketStore((state) => state.username);
  const setUsername = useWebSocketStore((state) => state.setUsername);
  const personality = useWebSocketStore((state) => state.personality);
  const setPersonality = useWebSocketStore((state) => state.setPersonality);
  const setSocketUrl = useWebSocketStore((state) => state.setSocketUrl);

  const { lastMessage } = useWebSocketContext();
  const [duplicateName, setDuplicateName] = useState(false);

  // Localstorage support
  useEffect(() => {
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [storedUsername, setUsername]);

  // Login
  useEffect(() => {
    if (!lastMessage) return;

    const data = JSON.parse(lastMessage.data);
    if (data.type === "error" && data.error === "Username already taken") {
      setDuplicateName(true);
    } else if (
      data.type === "success" &&
      data.message === "Login successfull"
    ) {
      navigate("/chat");
    }
  }, [lastMessage]);

  /**
   * Connect to socket using 'useWebSocketStore' hook
   * @param event
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if ((!username && !storedUsername) || !port) return;
    setSocketUrl("");
    setTimeout(() => {
      setSocketUrl(`ws://localhost:${port}`);
    }, 0);
  };

  return (
    <div className="flex flex-grow items-center justify-center pb-28 bg-teal-50 text-gray-800">
      <div className="space-y-4 w-80 md:w-96 bg-white shadow-md border-teal-100 p-6 rounded-lg">
        <h1 className="text-2xl mb-4 font-bold text-teal-600">Login</h1>
        <Form.Root className="space-y-4" onSubmit={handleSubmit}>
          <Form.Field className="grid" name="name">
            <div className="flex justify-between items-baseline">
              <Form.Label className="mb-1 font-medium text-teal-600">
                Name
              </Form.Label>
              <Form.Message
                className="text-[12px] font-medium text-teal-800 opacity-90"
                match={"valueMissing"}
              >
                Please enter a name
              </Form.Message>
              {duplicateName && (
                <Form.Message className="text-[12px] font-medium text-teal-800 opacity-90">
                  Username already taken
                </Form.Message>
              )}
            </div>
            <Form.Control asChild>
              <input
                className="p-2 border-[1.5px] border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your name"
                value={username || ""}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setStoredUsername(e.target.value);
                  setDuplicateName(false);
                }}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="grid" name="port">
            <div className="flex justify-between items-baseline">
              <Form.Label className="mb-1 font-medium text-teal-600">
                Port
              </Form.Label>
              <Form.Message
                className="text-[12px] font-medium text-teal-800 opacity-90"
                match="valueMissing"
              >
                Please enter a port
              </Form.Message>
              <Form.Message
                className="text-[12px] font-medium text-teal-800"
                match="typeMismatch"
              >
                Please enter a valid number
              </Form.Message>
            </div>

            <Form.Control asChild>
              <input
                type="number"
                inputMode="numeric"
                className="p-2 border-[1.5px] bg-teal-50 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter port number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
              />
            </Form.Control>
          </Form.Field>

          <div className="grid">
            <label className="mb-1 font-medium text-teal-600">
              Chatbot Personality
            </label>
            <Select.Root value={personality} onValueChange={setPersonality}>
              <Select.Trigger
                className="inline-flex items-center justify-between p-2 border-[1.5px] bg-teal-50 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Chatbot Personality"
              >
                <Select.Value placeholder="Select a personality" />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className="overflow-hidden bg-white rounded-lg shadow-md border border-teal-200"
                  position="popper"
                  sideOffset={5}
                >
                  <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-teal-600 cursor-default">
                    <ChevronUpIcon />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="p-1">
                    <Select.Group>
                      <Select.Label className="px-6 py-1 text-xs text-teal-700 font-semibold">
                        Personality Types
                      </Select.Label>

                      <SelectItem value="default">Helpful Assistant</SelectItem>
                      <SelectItem value="funny">Funny Assistant</SelectItem>
                      <SelectItem value="formal">Formal Assistant</SelectItem>
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-teal-600 cursor-default">
                    <ChevronDownIcon />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <p className="text-xs text-teal-600 mt-1">
              Select how you want the AI chatbot to respond to your messages
            </p>
          </div>

          <Form.Submit asChild>
            <button className="p-3 w-full font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg hover:cursor-pointer transition-colors duration-200 mt-2">
              Join Chat
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default LoginPage;
