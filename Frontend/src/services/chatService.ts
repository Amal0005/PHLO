import api from '@/axios/axiosConfig';
import { ConversationEntity, MessageEntity } from '@/interface/chat/chatInterface';
import { FRONTEND_ROUTES } from '@/constants/frontendRoutes';

export const chatService = {
  fetchConversations: async (): Promise<ConversationEntity[]> => {
    const res = await api.get(FRONTEND_ROUTES.CHAT.CONVERSATIONS);
    return res.data.conversation || [];
  },

  fetchMessages: async (convId: string, page = 1, limit = 20): Promise<MessageEntity[]> => {
    const res = await api.get(`${FRONTEND_ROUTES.CHAT.MESSAGES.replace(':id', convId)}?page=${page}&limit=${limit}`);
    return res.data.message || [];
  },

  markSeen: async (conversationId: string, recipientId?: string): Promise<void> => {
    await api.patch(FRONTEND_ROUTES.CHAT.MARK_SEEN, { conversationId, recipientId });
  },

  sendMessage: async (conversationId: string, payload: { message: string, receiverId: string, type: "text" | "image" }): Promise<MessageEntity> => {
    const res = await api.post(FRONTEND_ROUTES.CHAT.SEND_MESSAGE, {
      ...payload,
      conversationId
    });
    return res.data.message;
  },

  ensureConversation: async (bookingId: string): Promise<{ success: boolean; conversation?: ConversationEntity }> => {
    const res = await api.get(FRONTEND_ROUTES.CHAT.ENSURE_CONVERSATION.replace(':id', bookingId));
    return res.data;
  }
};
