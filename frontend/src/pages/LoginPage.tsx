import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import useWebSocketStore from "@stores/useWebSocketStore";
import { useWebSocketContext } from "@hooks/webSocketContext";
import UsernameInput from "@/components/Login/UsernameInput";
import PortInput from "@/components/Login/PortInput";
import PersonalitySelect from "@/components/Login/PersonalitySelect";

const LoginPage = () => {
  const navigate = useNavigate();

  const port = useWebSocketStore((state) => state.port);
  const setSocketUrl = useWebSocketStore((state) => state.setSocketUrl);

  const setDuplicateName = useWebSocketStore(
    (state) => state.setDuplicateUsername
  );

  const { lastMessage } = useWebSocketContext();

  // Handle login response
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
  }, [lastMessage, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Connecting to WebSocket:", `ws://localhost:${port}`);

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
          <UsernameInput />
          <PortInput />
          <PersonalitySelect />
          <Form.Submit asChild>
            <button className="p-3 w-full font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 mt-2">
              Join Chat
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default LoginPage;
