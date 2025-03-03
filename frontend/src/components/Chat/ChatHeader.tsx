import { useWebSocketContext } from "@/hooks/webSocketContext";
import useWebSocketStore from "@/stores/useWebSocketStore";

const Header = () => {
  const userCount = useWebSocketStore((state) => state.userCount);

  const { readyState, disconnect } = useWebSocketContext();

  const connected = readyState === WebSocket.OPEN;

  return (
    <div className="flex items-center align-middle justify-between p-2 bg-teal-100 border-b border-teal-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        {userCount > 1 && (
          <>
            <div className="w-3 h-3 rounded-full mr-2 bg-teal-600 animate-pulse" />
            <span className="font-medium">{`${userCount} users using AI Chat`}</span>
          </>
        )}
      </div>
      <div className="flex gap-4 font-medium reverse items-center">
        <div className="text-sm text-teal-700 dark:text-gray-300">
          {connected ? "Connected" : "Disconnected"}
        </div>
        <button
          className="px-3 py-2 bg-red-400 text-white text-sm rounded-lg hover:bg-red-500 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Header;
