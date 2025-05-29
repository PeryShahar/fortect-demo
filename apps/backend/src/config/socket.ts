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
}
