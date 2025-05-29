import { Server, Socket } from "socket.io";

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

const users = new Map<string, string>(); // socket.id -> username
const messages: Message[] = [];

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.id);

    // Send message history to new connection
    socket.emit("messageHistory", messages);

    // Handle user joining
    socket.on("join", (username: string) => {
      users.set(socket.id, username);
      console.log(`${username} joined`);

      // Notify all clients about new user
      io.emit("userJoined", username);
      io.emit("userList", Array.from(users.values()));
    });

    // Handle sending a new message
    socket.on("sendMessage", (data: { text: string }) => {
      const username = users.get(socket.id) || "Unknown";
      const message: Message = {
        id: socket.id + "-" + Date.now(),
        username,
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log(`Message from ${username}: ${data.text}`);

      messages.push(message);

      // Broadcast message to all clients
      io.emit("newMessage", message);
    });

    // Handle typing indicator
    socket.on("typing", () => {
      const username = users.get(socket.id);
      if (username) {
        socket.broadcast.emit("userTyping", username);
      }
    });

    socket.on("stopTyping", () => {
      const username = users.get(socket.id);
      if (username) {
        socket.broadcast.emit("userStoppedTyping", username);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const username = users.get(socket.id);
      if (username) {
        console.log(`${username} disconnected`);
        users.delete(socket.id);

        io.emit("userLeft", username);
        io.emit("userList", Array.from(users.values()));
      }
    });
  });

  startSimulatedMessages(io);
}

function startSimulatedMessages(io: Server) {
  const botNames = ["Bot-Alex", "Bot-Zara", "Bot-Jamie"];
  const sampleTexts = [
    "Hello, world!",
    "Did you know React was created by Facebook?",
    "TypeScript makes JavaScript safer.",
    "This is a simulated message.",
    "Socket.IO is awesome for real-time apps!",
  ];

  const generateFakeMessage = (): Message => {
    const username = botNames[Math.floor(Math.random() * botNames.length)];
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    return {
      id: "bot-" + Date.now(),
      username,
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
  };

  const emitFakeMessage = () => {
    const message = generateFakeMessage();
    io.emit("newMessage", message);
    console.log("Simulated message sent:", message);

    // Schedule the next one
    const nextDelay = Math.floor(Math.random() * 5000) + 5000; // 5–10 seconds
    setTimeout(() => emitFakeMessage(), nextDelay);
  };

  // Kick off the first simulated message
  emitFakeMessage();
}
