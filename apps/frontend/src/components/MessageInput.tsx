import { useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface MessageInputProps {
  socket: Socket | null;
  username: string;
  isConnected: boolean;
}

const MessageInput = ({ socket, username, isConnected }: MessageInputProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    if (!socket) return;
    socket.emit("typing");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping");
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!socket || !inputMessage.trim()) return;
    socket.emit("sendMessage", { text: inputMessage, username });
    setInputMessage("");
    socket.emit("stopTyping");
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
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
  );
};

export default MessageInput;
