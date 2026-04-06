import type { Socket } from "socket.io";
import { Server } from "socket.io";
import type http from "http";

export class SocketIOHandler {
  private static instance: SocketIOHandler;
  private io: Server;

  constructor(server: http.Server) {
    const origin = process.env.FRONTEND_URL || "http://localhost:5173";
    this.io = new Server(server, {
      cors: { 
        origin: [origin, origin.replace(/\/$/, "")], 
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    this.setupListeners();
    SocketIOHandler.instance = this;
  }

  public static emitToUser(userId: string, event: string, data: unknown) {
    if (SocketIOHandler.instance) {
      SocketIOHandler.instance.io.to(userId).emit(event, data);
    }
  }

  private setupListeners() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("join", (userId: string) => socket.join(userId));
    });
  }
}
