import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/store/chatStore";

interface MessageListProps {
  username: string;
}

const MessageList = ({ username }: MessageListProps) => {
  const messages = useChatStore((s) => s.messages);
  const typingUsers = useChatStore((s) => s.typingUsers);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
            {message.username !== username && message.username !== "System" && (
              <div className="text-xs font-bold text-gray-500 mb-1">
                {message.username}
              </div>
            )}
            <div>{message.text}</div>
            <div className="text-xs mt-1 opacity-70">{message.timestamp}</div>
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
  );
};

export default MessageList;
