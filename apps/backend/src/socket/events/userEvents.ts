import { Server, Socket } from "socket.io";

export function registerUserEvents(
  io: Server,
  socket: Socket,
  users: Map<string, string>,
) {
  socket.on("join", (username: string) => {
    users.set(socket.id, username);
    io.emit("userJoined", username);
    io.emit("userList", Array.from(users.values()));
  });

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
}
