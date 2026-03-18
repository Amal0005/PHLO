import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { MessageEntity } from "@/domain/entities/messageEntity";

export class ChatMapper {
  static toConversationEntity(
    doc: { _id?: { toString(): string }; id?: string; bookingId: { toString(): string }; participants: { toString(): string }[]; lastMessage?: string; lastMessageAt?: Date; createdAt: Date },
    user?: { name: string; image?: string } | null,
    creator?: { fullName: string; profilePhoto?: string } | null,
    packageName?: string,
    defaultUserName: string = "User",
  ): ConversationEntity {
    return {
      id: doc._id?.toString() || doc.id,
      bookingId: doc.bookingId.toString(),
      participants: doc.participants.map(p => p.toString()),
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

  static toMessageEntity(doc: { _id?: { toString(): string }; id?: string; conversationId: { toString(): string }; senderId: { toString(): string }; message: string; type?: "text" | "image"; seen?: boolean; createdAt: Date }): MessageEntity {
    return {
      id: doc._id?.toString() || doc.id,
      conversationId: doc.conversationId.toString(),
      senderId: doc.senderId.toString(),
      message: doc.message,
      type: doc.type || "text",
      seen: doc.seen || false,
      createdAt: doc.createdAt,
    };
  }
}
