import { create } from "zustand";

export type Message =
  | {
      type: "chat";
      username: string | null;
      text: string;
      sender: "user" | "ai";
    }
  | {
      type: "alert";
      username: string;
      action: "login" | "disconnect";
      timestamp: string;
    };

interface WebSocketStore {
  username: string | null;
  setUsername: (username: string | null) => void;
  socketUrl: string;
  setSocketUrl: (socketUrl: string) => void;
  userCount: number;
  setUserCount: (userCount: number) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}
const useWebSocketStore = create<WebSocketStore>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
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
