import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface JoinScreenProps {
  username: string;
  setUsername: (name: string) => void;
  isConnected: boolean;
  onJoin: () => void;
}

const JoinScreen = ({
  username,
  setUsername,
  isConnected,
  onJoin,
}: JoinScreenProps) => {
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
            onKeyPress={(e) => e.key === "Enter" && onJoin()}
            placeholder="Enter your username"
          />
        </div>
        <Button
          onClick={onJoin}
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
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;
