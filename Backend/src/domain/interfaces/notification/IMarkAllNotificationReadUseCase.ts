
export interface IMarkAllNotificationReadUseCase {
    markAllRead(recipientId: string): Promise<void>;
}
