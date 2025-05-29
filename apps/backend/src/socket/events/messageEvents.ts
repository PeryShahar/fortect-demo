import { Server, Socket } from "socket.io";
import { Message, SendMessagePayload } from "../../types/chat";

export function registerMessageEvents(
  io: Server,
  socket: Socket,
  users: Map<string, string>,
  messages: Message[],
) {
  socket.emit("messageHistory", messages);

  socket.on("sendMessage", (data: SendMessagePayload) => {
    const username = users.get(socket.id) || "Unknown";
    const message: Message = {
      id: `${socket.id}-${Date.now()}`,
      username,
      text: data.text,
      timestamp: new Date().toLocaleTimeString(),
    };
    messages.push(message);
    io.emit("newMessage", message);
  });
}
