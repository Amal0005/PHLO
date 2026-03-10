import { MessageEntity } from "@/domain/entities/messageEntity";

export interface IGetMessagesUseCase {
  getMessage(conversationId: string): Promise<MessageEntity[]>;
}
