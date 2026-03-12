export interface IMarkChatNotificationReadUseCase {
    markChatRead(recipientId: string, conversationId: string): Promise<void>;
}
