import { create } from "zustand";

export type Message =
  | {
      type: "chat";
      username: string | null;
      message: string;
      sender: "user" | "ai";
      timestamp: string;
    }
  | {
      type: "alert";
      username: string;
      action: "login" | "disconnect";
      timestamp: string;
    };

interface WebSocketStore {
  port: string | null;
  setPort: (port: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  duplicateUsername: boolean;
  setDuplicateUsername: (duplicateUsername: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  personality: string;
  setPersonality: (personality: string) => void;
  socketUrl: string;
  setSocketUrl: (socketUrl: string) => void;
  userCount: number;
  setUserCount: (userCount: number) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}
const useWebSocketStore = create<WebSocketStore>((set) => ({
  port: null,
  setPort: (port) => set({ port }),
  username: null,
  setUsername: (username) => set({ username }),
  duplicateUsername: false,
  setDuplicateUsername: (duplicateUsername) => set({ duplicateUsername }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  personality: "default",
  setPersonality: (personality) => set({ personality }),
  socketUrl: "",
  setSocketUrl: (socketUrl) => {
    set({ socketUrl });
  },
  userCount: 0,
  setUserCount: (userCount) => {
    set({ userCount });
  },
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
}));

export default useWebSocketStore;
