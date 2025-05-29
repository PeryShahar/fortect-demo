import { Socket } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import UserList from "./UserList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatLayoutProps {
  username: string;
  setUsername: (username: string) => void;
  setIsJoined: (joined: boolean) => void;
  socket: Socket | null;
  isConnected: boolean;
}

const ChatLayout = ({
  username,
  setUsername,
  setIsJoined,
  socket,
  isConnected,
}: ChatLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      <UserList username={username} />
      <div className="flex-1 flex flex-col">
        <ChatHeader
          isConnected={isConnected}
          socket={socket}
          setUsername={setUsername}
          setIsJoined={setIsJoined}
        />
        <MessageList username={username} />
        <MessageInput
          socket={socket}
          username={username}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
