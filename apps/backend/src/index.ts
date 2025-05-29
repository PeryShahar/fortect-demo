import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

import { setupSocketHandlers } from "./socket/socketHandlers";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "http://localhost:5173",
  },
});

setupSocketHandlers(io);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.get("/health", (_, res) => {
  res.send({ status: "ok" });
});

server.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
