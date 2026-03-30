import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from "@/store/store";
import { chatService } from "@/services/chatService";
import { socketService } from "@/services/socketService";
import ConversationList from "@/components/chat/conversationList";
import ChatWindow from "@/components/chat/chatWindow";
import { ConversationEntity, MessageEntity } from "@/interface/chat/chatInterface";
import Navbar from "@/components/reusable/userNavbar";
import CreatorNavbar from "@/components/reusable/creatorNavbar";
import { S3Media } from '@/components/reusable/s3Media';
import { useNotifications } from '@/hooks/useNotifications';
import { S3Service } from '@/services/s3Service';
import { toast } from 'react-toastify';
import MessageInput from '@/components/chat/messageInput';
import { ROUTES } from '@/constants/routes';

const ChatPage = () => {
    const { markChatAsRead } = useNotifications();
    const [searchParams] = useSearchParams();
    const bookingIdParam = searchParams.get('bookingId');
    const userState = useSelector((state: RootState) => state.user.user);
    const creatorState = useSelector((state: RootState) => state.creator.creator);
    const currentUser = userState || creatorState;

    const [conversations, setConversations] = useState<ConversationEntity[]>([]);
    const [selectedChat, setSelectedChat] = useState<ConversationEntity | null>(null);
    const [messages, setMessages] = useState<MessageEntity[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const currentUserId = currentUser?.id || (currentUser as unknown as { _id?: string })?._id;

    const fetchConversations = useCallback(async () => {
        try {
            const conversations = await chatService.fetchConversations();
            setConversations(conversations);
        } catch (err: unknown) {
            console.error("Failed to fetch conversations", err);
        }
    }, []);

    const fetchMessages = useCallback(async (convId: string) => {
        try {
            const messages = await chatService.fetchMessages(convId);
            setMessages(messages);
        } catch (err: unknown) {
            console.error("Failed to fetch messages", err);
        }
    }, []);

    const markSeen = useCallback(async (conv: ConversationEntity) => {
        if (!currentUserId) return;
        const conversationId = conv.id || (conv as unknown as { _id?: string })._id;
        if (!conversationId) return;

        const receiverId = conv.participants
            ?.map((p) => ((p as unknown as { _id?: string })?._id || (p as unknown as { id?: string })?.id || p)?.toString())
            .find((id?: string) => id !== currentUserId?.toString());

        try {
            await chatService.markSeen(conversationId, receiverId);
        } catch (err) {
            console.error("Failed to mark messages as seen", err);
        }
    }, [currentUserId]);

    const handleSelectChat = useCallback((conv: ConversationEntity) => {
        setSelectedChat(conv);
        setIsSidebarVisible(false);
        const convId = conv.id || (conv as unknown as { _id?: string })._id;
        if (convId) {
            fetchMessages(convId);
            markChatAsRead(convId);
            markSeen(conv);
        }
    }, [fetchMessages, markChatAsRead, markSeen]);

    const handleSendMessage = useCallback(async (text: string, type: "text" | "image" = "text") => {
        if (!selectedChat || !currentUserId) return;
        const conversationId = selectedChat.id || (selectedChat as unknown as { _id?: string })._id;
        if (!conversationId) return;

        const receiverId = selectedChat.participants
            .map((p: unknown) => (typeof p === 'object' && p !== null ? ((p as { _id?: string })._id || (p as { id?: string }).id) : p)?.toString())
            .find((id?: string) => id !== currentUserId.toString());

        if (!receiverId) {
            console.error("Could not determine receiverId", selectedChat.participants);
            return;
        }

        const payload = {
            message: text,
            receiverId,
            type
        };

        // Socket emit removed here, backend now handles broadcasting after saving to DB


        try {
            const message = await chatService.sendMessage(conversationId, payload);

            setMessages((prev: MessageEntity[]) => {
                const exists = prev.some(m => (m.id || (m as unknown as { _id?: string })._id)?.toString() === (message.id || (message as unknown as { _id?: string })._id)?.toString());
                if (exists) return prev;
                return [...prev, message];
            });
            fetchConversations();
        } catch (err: unknown) {
            console.error("Failed to send message", err);
        }
    }, [selectedChat, currentUserId, fetchConversations]);

    const handleImageSelect = useCallback(async (file: File) => {
        try {
            toast.info("Sending image...");
            const publicUrl = await S3Service.uploadToS3(file, "chat-images");
            await handleSendMessage(publicUrl, "image");
        } catch (err) {
            console.error("Image upload failed", err);
            toast.error("Failed to upload image");
        }
    }, [handleSendMessage]);

    useEffect(() => {
        if (!currentUserId) return;
        socketService.connect(currentUserId);
        fetchConversations();
    }, [currentUserId, fetchConversations]);

    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) {
            console.log("No socket available for ChatPage listener");
            return;
        }

        const handleReceive = (newMessage: MessageEntity) => {
            console.log("ChatPage: Received new message via socket:", newMessage);
            const selectedId = (selectedChat?.id || (selectedChat as unknown as { _id?: string })?._id)?.toString();
            const messageConvId = newMessage.conversationId?.toString();

            if (selectedId && messageConvId === selectedId) {
                setMessages((prev: MessageEntity[]) => {
                    const exists = prev.some(m => (m.id || (m as unknown as { _id?: string })._id)?.toString() === (newMessage.id || (newMessage as unknown as { _id?: string })._id)?.toString());
                    if (exists) return prev;
                    return [...prev, newMessage];
                });
                markChatAsRead(selectedId);
                if (selectedChat) markSeen(selectedChat);
            }
            fetchConversations();
        };

        const handleSeen = ({ conversationId }: { conversationId: string }) => {
            const selectedId = (selectedChat?.id || (selectedChat as unknown as { _id?: string })?._id)?.toString();
            if (selectedId && conversationId === selectedId) {
                setMessages((prev: MessageEntity[]) => 
                    prev.map(m => (!m.seen && (m.senderId?.toString() === currentUserId?.toString()) ? { ...m, seen: true } : m))
                );
            }
        };

        socket.on("receive-message", handleReceive);
        socket.on("messages-seen", handleSeen);
        return () => {
            socket.off("receive-message", handleReceive);
            socket.off("messages-seen", handleSeen);
        };
    }, [selectedChat, currentUserId, markChatAsRead, markSeen, fetchConversations]);

    useEffect(() => {
        const ensureAndSelect = async () => {
            if (bookingIdParam && currentUser && !selectedChat) {
                try {
                    const match = conversations.find((c: ConversationEntity) => c.bookingId === bookingIdParam);
                    if (match) {
                        handleSelectChat(match);
                        return;
                    }

                    const data = await chatService.ensureConversation(bookingIdParam);
                    if (data.success && data.conversation) {
                        const newConv = data.conversation;
                        const mappedConv = {
                            ...newConv,
                            id: newConv.id || (newConv as unknown as { _id?: string })._id
                        };

                        await fetchConversations();
                        handleSelectChat(mappedConv);
                    }
                } catch (err: unknown) {
                    console.error("Failed to ensure conversation", err);
                }
            }
        };

        if (conversations.length > 0 || bookingIdParam) {
            ensureAndSelect();
        }
    }, [conversations, bookingIdParam, currentUser, handleSelectChat, selectedChat, fetchConversations]);

    if (!currentUser) return <div className="p-8 text-center text-gray-500 font-sans uppercase tracking-[0.2em] pt-32">Authentication Required</div>;

    return (
        <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-white selection:text-black overflow-hidden h-screen">
            {userState ? <Navbar scrollToSection={() => {}} /> : <CreatorNavbar />}

            <div className="flex-1 flex mt-[80px] overflow-hidden relative">
                {/* Conversations Sidebar */}
                <div className={`${isSidebarVisible ? 'flex' : 'hidden md:flex'} w-full md:w-80 lg:w-96 border-r border-zinc-900 bg-zinc-950 flex flex-col transition-all duration-300 z-20`}>
                    <ConversationList
                        conversations={conversations}
                        onSelect={handleSelectChat}
                        selectedId={selectedChat?.id || (selectedChat as unknown as { _id?: string })?._id}
                    />
                </div>

                {/* Main Chat Area */}
                <div className={`${!isSidebarVisible ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#1E1E1E] relative lg:p-4`}>
                    {selectedChat ? (
                        <div className="flex-1 flex flex-col bg-[#121212]/30 lg:rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
                            {/* Chat Header Header */}
                            <div className="px-6 py-5 bg-[#2A2A2A]/40 backdrop-blur-3xl flex items-center justify-between z-10 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setIsSidebarVisible(true)}
                                        className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center ring-2 ring-white/5">
                                        {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT) ? (
                                            selectedChat?.participantDetails?.userImage ? (
                                                <S3Media s3Key={selectedChat.participantDetails.userImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                                    <span className="text-zinc-600 font-black uppercase text-[12px]">{selectedChat?.participantDetails?.userName?.slice(0, 2) || 'US'}</span>
                                                </div>
                                            )
                                        ) : (
                                            selectedChat?.participantDetails?.creatorImage ? (
                                                <S3Media s3Key={selectedChat.participantDetails.creatorImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                                    <span className="text-zinc-600 font-black uppercase text-[12px]">{selectedChat?.participantDetails?.creatorName?.slice(0, 2) || 'CR'}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] truncate">
                                            {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT)
                                                ? (selectedChat?.participantDetails?.userName || "Client")
                                                : (selectedChat?.participantDetails?.creatorName || "Creator")}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Window */}
                            <div className="flex-1 overflow-hidden relative">
                                <ChatWindow 
                                    messages={messages} 
                                    currentUserId={currentUserId!} 
                                    recipientName={window.location.pathname.startsWith(ROUTES.CREATOR.ROOT) ? selectedChat.participantDetails?.userName : selectedChat.participantDetails?.creatorName}
                                    recipientImage={window.location.pathname.startsWith(ROUTES.CREATOR.ROOT) ? selectedChat.participantDetails?.userImage : selectedChat.participantDetails?.creatorImage}
                                />
                            </div>

                            {/* Message Input */}
                            <div className="px-6 py-6 mt-auto">
                                <div className="max-w-5xl mx-auto w-full">
                                    <MessageInput
                                        onSendMessage={handleSendMessage} 
                                        onImageSelect={handleImageSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full animate-pulse" />
                                <div className="w-24 h-24 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] flex items-center justify-center relative shadow-2xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:opacity-100 transition-opacity" />
                                    <svg className="w-10 h-10 text-zinc-700 group-hover:text-zinc-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-3 max-w-sm">
                               
                                <p className="text-zinc-500 text-[10px] md:text-xs font-medium leading-loose uppercase tracking-[0.1em] pt-4">
                                    Initialize a discussion from your engagement panel to proceed.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

