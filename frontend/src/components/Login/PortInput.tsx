import * as Form from "@radix-ui/react-form";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect } from "react";
import useWebSocketStore from "@/stores/useWebSocketStore";

const PortInput = () => {
  const [storedPort, setStoredPort] = useLocalStorage("port");

  const port = useWebSocketStore((state) => state.port);
  const setPort = useWebSocketStore((state) => state.setPort);

  useEffect(() => {
    if (storedPort) {
      setPort(storedPort);
    }
  }, [storedPort, setPort]);

  return (
    <Form.Field className="grid" name="port">
      <div className="flex justify-between items-baseline">
        <Form.Label className="mb-1 font-medium text-teal-600">Port</Form.Label>
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
          value={port || ""}
          onChange={(e) => {
            setPort(e.target.value);
            setStoredPort(e.target.value);
          }}
          required
        />
      </Form.Control>
    </Form.Field>
  );
};

export default PortInput;
