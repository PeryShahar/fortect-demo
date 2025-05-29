import { Socket } from "socket.io";

import { SocketService } from "../services/socket.service";

export class SocketController {
  private service: SocketService;
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.service = new SocketService();
  }

  registerEvents() {
    this.socket.on("ping", this.onPing.bind(this));

    // Add other event listeners here
  }

  private onPing() {
    const response = this.service.handlePing();
    this.socket.emit("pong", response);
  }
}
