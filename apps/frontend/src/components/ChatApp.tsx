import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import { useChatStore } from "@/lib/store/chatStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChatApp = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);
  const resetStore = useChatStore((state) => state.reset);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Socket.io setup
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("connect_error", () => setIsConnected(false));

    newSocket.on("newMessage", (message) => addMessage(message));
    newSocket.on("messageHistory", (history) => setMessages(history));

    newSocket.on("userJoined", (username) => {
      addMessage({
        id: Date.now() + Math.random(),
        username: "System",
        text: `${username} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    newSocket.on("userLeft", (username) => {
      addMessage({
        id: Date.now() + Math.random(),
        username: "System",
        text: `${username} left the chat`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    newSocket.on("userList", setUsers);
    newSocket.on("userTyping", (name) => {
      setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
    });
    newSocket.on("userStoppedTyping", (name) =>
      setTypingUsers((prev) => prev.filter((u) => u !== name)),
    );

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = () => {
    if (socket && username.trim()) {
      socket.emit("join", username);
      setIsJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (socket && inputMessage.trim() && isJoined) {
      socket.emit("sendMessage", { text: inputMessage });
      setInputMessage("");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit("stopTyping");
    }
  };

  const handleTyping = () => {
    if (socket && isJoined) {
      socket.emit("typing");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping");
      }, 2000);
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      isJoined ? handleSendMessage() : handleJoin();
    }
  };

  // Join screen
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black">
          <h1 className="text-center text-xl font-semibold mb-6 text-gray-800">
            Join Chat Room
          </h1>
          <div className="mb-4">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
            />
          </div>
          <Button
            onClick={handleJoin}
            disabled={!username.trim() || !isConnected}
            className="w-full"
          >
            {isConnected ? "Join Chat" : "Connecting..."}
          </Button>
          <div className="mt-4 text-center flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-500">
              {isConnected ? "Connected to server" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Chat UI
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg text-gray-800">
            👥 Online Users ({users.length})
          </h2>
        </div>
        <div className="p-4 flex-1">
          {users.map((user, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span
                className={`text-sm ${
                  user === username
                    ? "font-bold text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {user} {user === username && "(you)"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl text-gray-800">💬 Fortect Chat</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-500">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
            <Button
              onClick={() => {
                socket?.disconnect();
                setSocket(null);
                resetStore();
                setUsername("");
                setIsJoined(false);
              }}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded transition"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.username === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg text-sm ${
                  message.username === "System"
                    ? "bg-yellow-100 text-yellow-800"
                    : message.username.startsWith("Bot-")
                      ? "bg-green-100 text-gray-800"
                      : message.username === username
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.username !== username &&
                  message.username !== "System" && (
                    <div className="text-xs font-bold text-gray-500 mb-1">
                      {message.username}
                    </div>
                  )}
                <div>{message.text}</div>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-500 italic mb-4">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
              typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
