import { Server, Socket } from "socket.io";
import http from "http";

interface SendMessageData {
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
}

export class SocketIOHandler {
  private io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] }
    });
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("join", (userId: string) => socket.join(userId));
      socket.on("send-message", (data: SendMessageData) => {
        this.io.to(data.receiverId).emit("receive-message", data);
      });
    });
  }
}
