import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import useWebSocketStore from "../stores/useWebSocketStore";
import { useWebSocketContext } from "../hooks/webSocketContext";
import useLocalStorage from "../hooks/useLocalStorage";

const LoginPage = () => {
  const [storedUsername, setStoredUsername] = useLocalStorage("username");
  const [port, setPort] = useLocalStorage("port");

  const navigate = useNavigate();

  const username = useWebSocketStore((state) => state.username);
  const setUsername = useWebSocketStore((state) => state.setUsername);
  const setSocketUrl = useWebSocketStore((state) => state.setSocketUrl);

  const { lastMessage } = useWebSocketContext();
  const [duplicateName, setDuplicateName] = useState(false);

  useEffect(() => {
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [storedUsername, setUsername]);

  /** Login */
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

  /** Connect to socket using 'useWebSocketStore' hook */
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
      <div className="space-y-4 w-80 md:w-96 bg-teal-200 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 font-bold text-teal-800">Login</h1>
        <Form.Root className="space-y-4" onSubmit={handleSubmit}>
          <Form.Field className="grid" name="name">
            <div className="flex justify-between items-baseline">
              <Form.Label className="mb-1 font-medium text-teal-700">
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
              <Form.Label className="mb-1 font-medium text-teal-700">
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
