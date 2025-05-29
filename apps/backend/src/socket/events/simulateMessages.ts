import { Server } from "socket.io";
import { Message } from "../../types/chat";

export function startSimulatedMessages(io: Server) {
  const botNames = ["Bot-Alex", "Bot-Zara", "Bot-Jamie"];
  const sampleTexts = [
    "Hello, world!",
    "Did you know React was created by Facebook?",
    "TypeScript makes JavaScript safer.",
    "This is a simulated message.",
    "Fortect is the best",
    "Socket.IO is awesome for real-time apps!",
  ];

  const generateFakeMessage = (): Message => {
    const username = botNames[Math.floor(Math.random() * botNames.length)];
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    return {
      id: `bot-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      username,
      text,
      timestamp: new Date().toLocaleTimeString(),
    };
  };

  const emitFakeMessage = () => {
    const message = generateFakeMessage();
    io.emit("newMessage", message);
    console.log("Simulated message sent:", message);
    setTimeout(emitFakeMessage, Math.random() * 5000 + 5000);
  };

  emitFakeMessage();
}
