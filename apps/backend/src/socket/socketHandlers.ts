import { Server, Socket } from "socket.io";
import { registerMessageEvents } from "./events/messageEvents";
import { registerUserEvents } from "./events/userEvents";
import { startSimulatedMessages } from "./events/simulateMessages";

import { Message } from "../types/chat";

const users = new Map<string, string>();
const messages: Message[] = [];

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Register all event modules
    registerUserEvents(io, socket, users);
    registerMessageEvents(io, socket, users, messages);

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
