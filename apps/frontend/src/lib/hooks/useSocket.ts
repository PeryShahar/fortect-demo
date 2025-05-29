import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useChatStore } from "@/lib/store/chatStore";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const addMessage = useChatStore((s) => s.addMessage);
  const setMessages = useChatStore((s) => s.setMessages);
  const setUsers = useChatStore((s) => s.setUsers);
  const addTypingUser = useChatStore((s) => s.addTypingUser);
  const removeTypingUser = useChatStore((s) => s.removeTypingUser);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("connect_error", () => setIsConnected(false));

    newSocket.on("messageHistory", setMessages);
    newSocket.on("newMessage", addMessage);
    newSocket.on("userList", setUsers);

    newSocket.on("userJoined", (name) => {
      addMessage({
        id: (Date.now() + Math.random()).toString(),
        username: "System",
        text: `${name} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    newSocket.on("userLeft", (name) => {
      addMessage({
        id: (Date.now() + Math.random()).toString(),
        username: "System",
        text: `${name} left the chat`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    newSocket.on("userTyping", addTypingUser);
    newSocket.on("userStoppedTyping", removeTypingUser);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
