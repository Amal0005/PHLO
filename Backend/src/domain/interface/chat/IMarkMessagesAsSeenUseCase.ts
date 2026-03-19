import { MessageEntity } from "@/domain/entities/messageEntity";

export interface IMarkMessagesAsSeenUseCase {
  markAsSeen(conversationId: string, userId: string): Promise<void>;
}
