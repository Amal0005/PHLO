import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { MessageEntity } from "@/domain/entities/messageEntity";

export class ChatMapper {
  static toConversationEntity(
    doc: any,
    user?: { name: string; image?: string } | null,
    creator?: { fullName: string; profilePhoto?: string } | null,
    packageName?: string,
    defaultUserName: string = "User",
  ): ConversationEntity {
    return {
      id: doc._id?.toString() || doc.id,
      bookingId: doc.bookingId,
      participants: doc.participants,
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
      createdAt: doc.createdAt,
      participantDetails: {
        userName: user?.name || defaultUserName,
        userImage: user?.image || "",
        creatorName: creator?.fullName || "Creator",
        creatorImage: creator?.profilePhoto || "",
      },
      packageName: packageName,
    };
  }

  static toMessageEntity(doc: any): MessageEntity {
    return {
      id: doc._id?.toString() || doc.id,
      conversationId: doc.conversationId,
      senderId: doc.senderId,
      message: doc.message,
      type: doc.type || "text",
      seen: doc.seen || false,
      createdAt: doc.createdAt,
    };
  }
}
