import { create } from "zustand";

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface ChatState {
  username: string;
  isJoined: boolean;
  isConnected: boolean;
  messages: Message[];
  users: string[];
  typingUsers: string[];
  setUsername: (name: string) => void;
  setIsJoined: (joined: boolean) => void;
  setIsConnected: (connected: boolean) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setUsers: (users: string[]) => void;
  addTypingUser: (username: string) => void;
  removeTypingUser: (username: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  username: "",
  isJoined: false,
  isConnected: false,
  messages: [],
  users: [],
  typingUsers: [],
  setUsername: (name) => set({ username: name }),
  setIsJoined: (joined) => set({ isJoined: joined }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setUsers: (users) => set({ users }),
  addTypingUser: (name) => {
    const typingUsers = get().typingUsers;
    if (!typingUsers.includes(name)) {
      set({ typingUsers: [...typingUsers, name] });
    }
  },
  removeTypingUser: (name) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter((u) => u !== name),
    }));
  },
  reset: () =>
    set({
      username: "",
      isJoined: false,
      isConnected: false,
      messages: [],
      users: [],
      typingUsers: [],
    }),
}));
