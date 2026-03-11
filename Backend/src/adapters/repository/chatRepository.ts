import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { ConversationModel, ConversationDocument } from "../../framework/database/model/conversationModel";
import { MessageModel, MessageDocument } from "../../framework/database/model/messageModel";
import { IChatRepository } from "@/domain/interface/repositories/IChatRepository ";
import { MessageEntity } from "@/domain/entities/messageEntity";
import { UserModel } from "../../framework/database/model/userModel";
import { CreatorModel } from "../../framework/database/model/creatorModel";
import { ChatMapper } from "../mappers/chatMapper";

export class ChatRepository implements IChatRepository {
  async createConversation(data: Partial<ConversationEntity>): Promise<ConversationEntity> {
    const doc = await ConversationModel.create(data);
    return this.mapConversationEntity(doc);
  }

  async getConversationByBooking(bookingId: string): Promise<ConversationEntity | null> {
    const d = await ConversationModel.findOne({ bookingId }).lean() as ConversationDocument | null;
    if (!d) return null;

    const uId = d.participants[0];
    const cId = d.participants[1];

    const [user, creator] = await Promise.all([
      UserModel.findById(uId).select("name image").lean(),
      CreatorModel.findById(cId).select("fullName profilePhoto").lean()
    ]);

    return ChatMapper.toConversationEntity(d, user, creator);
  }

  async getConversationsByUserId(userId: string): Promise<ConversationEntity[]> {
    const docs = await ConversationModel.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean() as ConversationDocument[];

    const conversations = await Promise.all(docs.map(async (d) => {
      const uId = d.participants[0];
      const cId = d.participants[1];

      const [user, creator] = await Promise.all([
        UserModel.findById(uId).select("name image").lean(),
        CreatorModel.findById(cId).select("fullName profilePhoto").lean()
      ]);

      return ChatMapper.toConversationEntity(d, user, creator, 'Client');
    }));

    return conversations;
  }

  async getMessagesByConversationId(conversationId: string): Promise<MessageEntity[]> {
    const docs = await MessageModel.find({ conversationId }).sort({ createdAt: 1 }).lean() as MessageDocument[];
    return docs.map((d) => this.mapToMessageEntity(d));
  }


  async saveMessage(data: Partial<MessageEntity>): Promise<MessageEntity> {
    const doc = await MessageModel.create(data);
    return this.mapToMessageEntity(doc);
  }

  async updateConversationLastMessage(conversationId: string, message: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageAt: new Date()
    });
  }


  private mapConversationEntity(doc: ConversationDocument): ConversationEntity {
    return {
      id: doc._id.toString(),
      bookingId: doc.bookingId,
      participants: doc.participants,
      lastMessage: doc.lastMessage,
      lastMessageAt: doc.lastMessageAt,
      createdAt: doc.createdAt,
    };
  }

  private mapToMessageEntity(doc: MessageDocument): MessageEntity {
    return {
      id: doc._id.toString(),
      conversationId: doc.conversationId,
      senderId: doc.senderId,
      message: doc.message,
      type: doc.type || 'text',
      seen: doc.seen || false,
      createdAt: doc.createdAt,
    };
  }
}

