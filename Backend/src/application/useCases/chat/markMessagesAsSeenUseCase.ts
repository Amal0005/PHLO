import type { IMarkMessagesAsSeenUseCase } from "@/domain/interfaces/chat/IMarkMessagesAsSeenUseCase";
import type { IChatRepository } from "@/domain/interfaces/repository/IChatRepository";

export class MarkMessagesAsSeenUseCase implements IMarkMessagesAsSeenUseCase {
    constructor(private _chatRepo: IChatRepository) {}

    async markAsSeen(conversationId: string, userId: string): Promise<void> {
        await this._chatRepo.markMessagesAsSeen(conversationId, userId);
        
        // Notify other participants (simplified: for now just broadcast the event)
        // In a real app, we'd find the other participant's ID
        // But since we can only mark others' messages as seen, 
        // we can just emit a general event to the conversation participants.
        // Actually, SocketIOHandler.emitToUser is better.
    }
}
