import { ConversationEntity } from "@/domain/entities/conversationEntity";
import { ConversationModel } from "../../framework/database/model/conversationModel";
import { MessageModel } from "../../framework/database/model/messageModel";
import { IChatRepository } from "@/domain/interface/repository/IChatRepository";
import { MessageEntity } from "@/domain/entities/messageEntity";
import { UserModel } from "../../framework/database/model/userModel";
import { CreatorModel } from "../../framework/database/model/creatorModel";
import { BookingModel } from "../../framework/database/model/bookingModel";
import { ChatMapper } from "../../application/mapper/chatMapper";

export class ChatRepository implements IChatRepository {
  async createConversation(data: Partial<ConversationEntity>): Promise<ConversationEntity> {
    const doc = await ConversationModel.create(data);
    return ChatMapper.toConversationEntity(doc.toObject());
  }

  async getConversationByBooking(bookingId: string): Promise<ConversationEntity | null> {
    const d = await ConversationModel.findOne({ bookingId }).lean();
    if (!d) return null;

    const uId = d.participants[0];
    const cId = d.participants[1];

    const [participantData, booking] = await Promise.all([
      Promise.all([
        UserModel.findById(uId).select("name image").lean(),
        CreatorModel.findById(cId).select("fullName profilePhoto").lean()
      ]),
      BookingModel.findById(d.bookingId).populate<{ packageId: { title: string } }>('packageId', 'title').lean()
    ]);

    const [user, creator] = participantData;
    const packageName = booking?.packageId?.title || "Unknown Package";

    return ChatMapper.toConversationEntity({
      ...d,
      _id: d._id.toString(),
      bookingId: d.bookingId.toString(),
      participants: d.participants.map(p => p.toString())
    }, user, creator, packageName);
  }

  async getConversationsByUserId(userId: string): Promise<ConversationEntity[]> {
    const docs = await ConversationModel.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean();

    const conversations = await Promise.all(docs.map(async (d) => {
      const uId = d.participants[0];
      const cId = d.participants[1];

      const [participantData, booking] = await Promise.all([
        Promise.all([
          UserModel.findById(uId).select("name image").lean(),
          CreatorModel.findById(cId).select("fullName profilePhoto").lean()
        ]),
        BookingModel.findById(d.bookingId).populate<{ packageId: { title: string } }>('packageId', 'title').lean()
      ]);

      const [user, creator] = participantData;
      const packageName = booking?.packageId?.title || "Unknown Package";

      return ChatMapper.toConversationEntity({
        ...d,
        _id: d._id.toString(),
        bookingId: d.bookingId.toString(),
        participants: d.participants.map(p => p.toString())
      }, user, creator, packageName, 'Client');
    }));

    return conversations;
  }

  async getMessagesByConversationId(conversationId: string): Promise<MessageEntity[]> {
    const docs = await MessageModel.find({ conversationId }).sort({ createdAt: 1 }).lean();
    return docs.map((d) => ChatMapper.toMessageEntity(d));
  }


  async saveMessage(data: Partial<MessageEntity>): Promise<MessageEntity> {
    const doc = await MessageModel.create(data);
    return ChatMapper.toMessageEntity(doc.toObject());
  }

  async updateConversationLastMessage(conversationId: string, message: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageAt: new Date()
    });
  }
}

