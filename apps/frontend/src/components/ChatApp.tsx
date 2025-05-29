import { useState } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import JoinScreen from "./JoinScreen";
import ChatLayout from "./ChatLayout";

const ChatApp = () => {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const { socket, isConnected } = useSocket();

  if (!isJoined) {
    return (
      <JoinScreen
        username={username}
        setUsername={setUsername}
        isConnected={isConnected}
        onJoin={() => {
          socket?.emit("join", username);
          setIsJoined(true);
        }}
      />
    );
  }

  return (
    <ChatLayout
      username={username}
      setUsername={setUsername}
      setIsJoined={setIsJoined}
      socket={socket}
      isConnected={isConnected}
    />
  );
};

export default ChatApp;
