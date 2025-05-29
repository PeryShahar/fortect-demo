import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useChatStore } from "@/lib/store/chatStore";

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

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    // Chat events
    newSocket.on("newMessage", (message) => {
      console.log("New message received:", message);
      addMessage(message);
    });

    newSocket.on("messageHistory", (history) => {
      console.log("Message history received:", history);
      setMessages(history);
    });

    newSocket.on("userJoined", (username) => {
      console.log("User joined:", username);
      const joinMessage = {
        id: Date.now() + Math.random(),
        username: "System",
        text: `${username} joined the chat`,
        timestamp: new Date().toLocaleTimeString(),
      };
      addMessage(joinMessage);
    });

    newSocket.on("userLeft", (username) => {
      console.log("User left:", username);
      const leaveMessage = {
        id: Date.now() + Math.random(),
        username: "System",
        text: `${username} left the chat`,
        timestamp: new Date().toLocaleTimeString(),
      };
      addMessage(leaveMessage);
    });

    newSocket.on("userList", (userList) => {
      console.log("User list updated:", userList);
      setUsers(userList);
    });

    newSocket.on("userTyping", (username) => {
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    });

    newSocket.on("userStoppedTyping", (username) => {
      setTypingUsers((prev) => prev.filter((user) => user !== username));
    });

    return () => {
      console.log("Cleaning up socket connection");
      newSocket.close();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Join chat function
  const handleJoin = () => {
    if (socket && username.trim()) {
      console.log("Joining chat as:", username);
      socket.emit("join", username);
      setIsJoined(true);
    }
  };

  // Send message function
  const handleSendMessage = () => {
    if (socket && inputMessage.trim() && isJoined) {
      console.log("Sending message:", inputMessage);
      socket.emit("sendMessage", {
        text: inputMessage,
      });
      setInputMessage("");

      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit("stopTyping");
    }
  };

  // Handle typing
  const handleTyping = () => {
    if (socket && isJoined) {
      socket.emit("typing");

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping");
      }, 2000);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter") {
      if (!isJoined) {
        handleJoin();
      } else {
        handleSendMessage();
      }
    }
  };

  // Join screen
  if (!isJoined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
            color: "#000",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#1f2937",
            }}
          >
            Join Chat Room
          </h1>

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={!username.trim() || !isConnected}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: isConnected ? "#3b82f6" : "#9ca3af",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: isConnected ? "pointer" : "not-allowed",
            }}
          >
            {isConnected ? "Join Chat" : "Connecting..."}
          </button>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isConnected ? "#10b981" : "#ef4444",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {isConnected ? "Connected to server" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.125rem", color: "#1f2937" }}>
            👥 Online Users ({users.length})
          </h2>
        </div>

        <div style={{ padding: "1rem", flex: 1 }}>
          {users.map((user, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
              ></div>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: user === username ? "bold" : "normal",
                  color: user === username ? "#3b82f6" : "#374151",
                }}
              >
                {user} {user === username && "(you)"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.25rem", color: "#1f2937" }}>
            💬 Fortect Chat
          </h1>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-500">
              {isConnected ? "Connected" : "Disconnected"}
            </span>

            {/* Logout button */}
            <button
              onClick={() => {
                if (socket) {
                  socket.disconnect();
                  setSocket(null);
                }
                resetStore();
                setUsername("");
                setIsJoined(false);
              }}
              className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "1rem",
            backgroundColor: "#ffffff",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent:
                  message.username === username ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  backgroundColor: message?.username?.startsWith("Bot-")
                    ? "#d1fae5" // light green
                    : message.username === username
                      ? "#3b82f6"
                      : message.username === "System"
                        ? "#fef3c7"
                        : "#f3f4f6",
                  color:
                    message.username === username
                      ? "white"
                      : message.username === "System"
                        ? "#92400e"
                        : "#1f2937",
                }}
              >
                {message.username !== username &&
                  message.username !== "System" && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        marginBottom: "0.25rem",
                        color: "#6b7280",
                      }}
                    >
                      {message.username}
                    </div>
                  )}
                <div style={{ fontSize: "0.875rem" }}>{message.text}</div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                    opacity: 0.7,
                  }}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {typingUsers.length > 0 && (
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                fontStyle: "italic",
                marginBottom: "1rem",
              }}
            >
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
              typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div
          style={{
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "1rem",
                outline: "none",
                color: "#374151",
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor:
                  isConnected && inputMessage.trim() ? "#3b82f6" : "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor:
                  isConnected && inputMessage.trim()
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
