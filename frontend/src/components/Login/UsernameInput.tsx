import * as Form from "@radix-ui/react-form";
import { useEffect } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useWebSocketStore from "@stores/useWebSocketStore";
import { useWebSocketContext } from "@/hooks/webSocketContext";

const UsernameInput = () => {
  const [storedUsername, setStoredUsername] = useLocalStorage("username");
  const username = useWebSocketStore((state) => state.username);
  const setUsername = useWebSocketStore((state) => state.setUsername);
  const duplicateName = useWebSocketStore((state) => state.duplicateUsername);
  const setDuplicateName = useWebSocketStore(
    (state) => state.setDuplicateUsername
  );

  const { lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [storedUsername, setUsername]);

  useEffect(() => {
    if (!lastMessage) return;
    const data = JSON.parse(lastMessage.data);
    if (data.type === "error" && data.error === "Username already taken") {
      setDuplicateName(true);
    } else {
      setDuplicateName(false);
    }
  }, [lastMessage]);

  return (
    <Form.Field className="grid" name="name">
      <div className="flex justify-between items-baseline">
        <Form.Label className="mb-1 font-medium text-teal-600">Name</Form.Label>
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
  );
};

export default UsernameInput;
