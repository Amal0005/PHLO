import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        // Derive backend URL if VITE_BACKEND_URL is missing
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BASE_URL?.replace('/api', '') || "http://localhost:5000";

        console.log("Connecting to socket at:", backendUrl, "for user:", userId);

        // Always disconnect stale socket before reconnecting
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.socket = io(backendUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'] // Try both
        });

        // Wait for connection before joining the room
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

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
