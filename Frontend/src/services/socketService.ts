import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;

    connect(userId: string) {
        if (this.socket?.connected && this.userId === userId) {
            console.log("Already connected for user:", userId, ". Re-emitting join just in case.");
            this.socket.emit("join", userId);
            return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BASE_URL?.replace(/\/api$/, '');
        console.log("Connecting/Reconnecting to socket at:", backendUrl, "for user:", userId);

        if (this.socket) {
            this.socket.disconnect();
        }

        this.userId = userId;
        this.socket = io(backendUrl, {
            path: "/api/socket.io",
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.socket.on("connect", () => {
            console.log("Socket connected successfully with ID:", this.socket?.id);
            this.socket?.emit("join", userId);
        });

        this.socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });
    }

    getSocket() {
        return this.socket;
    }

    hasListeners(event: string) {
        return this.socket?.hasListeners(event) || false;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
