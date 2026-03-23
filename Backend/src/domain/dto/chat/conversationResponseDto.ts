export interface ConversationResponseDTO {
  id: string;
  bookingId: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  participantDetails?: {
    userName: string;
    userImage?: string;
    creatorName: string;
    creatorImage?: string;
  };
  packageName?: string;
}
