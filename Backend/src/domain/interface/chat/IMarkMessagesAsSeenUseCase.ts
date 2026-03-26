export interface IMarkMessagesAsSeenUseCase {
  markAsSeen(conversationId: string, userId: string): Promise<void>;
}
