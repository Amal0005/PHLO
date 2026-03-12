export interface ConversationEntity {
    id?: string;
    bookingId: string;
    participants: string[];
    lastMessage?: string;
    lastMessageAt?: string | Date;
    createdAt?: string | Date;
    participantDetails?: {
        userName: string;
        userImage?: string;
        creatorName: string;
        creatorImage?: string;
    };
    packageName?: string;
}

export interface MessageEntity {
    id?: string;
    conversationId: string;
    senderId: string;
    message: string;
    type: "text" | "image";
    seen: boolean;
    createdAt?: string | Date;
}
