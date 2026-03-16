export interface MessageEntity {
  id?: string;
  conversationId: string;
  senderId: string;
  message: string;
  type: "text" | "image";
  seen: boolean;
  createdAt?: Date;
}
