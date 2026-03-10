import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { ConversationDocument } from "../../framework/database/model/conversationModel";

export class ChatMapper {
    static toConversationEntity(
        doc: ConversationDocument,
        user?: { name: string; image?: string } | null,
        creator?: { fullName: string; profilePhoto?: string } | null,
        defaultUserName: string = 'User'
    ): ConversationEntity {
        return {
            id: doc._id.toString(),
            bookingId: doc.bookingId,
            participants: doc.participants,
            lastMessage: doc.lastMessage,
            lastMessageAt: doc.lastMessageAt,
            createdAt: doc.createdAt,
            participantDetails: {
                userName: user?.name || defaultUserName,
                userImage: user?.image || '',
                creatorName: creator?.fullName || 'Creator',
                creatorImage: creator?.profilePhoto || ''
            }
        };
    }
}
