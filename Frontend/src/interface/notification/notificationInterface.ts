export enum NotificationType {
    CHAT = "CHAT",
    BOOKING = "BOOKING",
    WALLET = "WALLET",
    ACCOUNT = "ACCOUNT",
    REPORT = "REPORT",
}

export interface NotificationEntity {
    id: string;
    recipientId: string;
    senderId?: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
}
