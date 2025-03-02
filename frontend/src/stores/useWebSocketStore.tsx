import { NavigateFunction } from "react-router-dom";
import { create } from "zustand";

interface WebSocketStore {
  username: string | null;
  setUsername: (username: string | null) => void;
  socketUrl: string;
  setSocketUrl: (socketUrl: string) => void;
  userCount: number;
  setUserCount: (userCount: number) => void;
  navigate: NavigateFunction | null;
  setNavigate: (navigate: NavigateFunction) => void;
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
  navigate: null,
  setNavigate: (navigate) => set({ navigate }),
}));

export default useWebSocketStore;
