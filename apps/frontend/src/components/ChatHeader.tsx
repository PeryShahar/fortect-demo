import { Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { useChatStore } from "@/lib/store/chatStore";

interface ChatHeaderProps {
  isConnected: boolean;
  socket: Socket | null;
  setUsername: (name: string) => void;
  setIsJoined: (joined: boolean) => void;
}

const ChatHeader = ({
  isConnected,
  socket,
  setUsername,
  setIsJoined,
}: ChatHeaderProps) => {
  const resetStore = useChatStore((s) => s.reset);

  const handleLogout = () => {
    socket?.disconnect();
    resetStore();
    setUsername("");
    setIsJoined(false);
  };

  return (
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
          onClick={handleLogout}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded transition"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
