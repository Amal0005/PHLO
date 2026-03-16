export const NotificationType = {
    CHAT: "CHAT",
    BOOKING: "BOOKING",
    WALLET: "WALLET",
    ACCOUNT: "ACCOUNT",
    REPORT: "REPORT",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationEntity {
    id: string;
    recipientId: string;
    senderId?: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
    isRead: boolean;
    createdAt: Date;
}
