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
    const conversationIdParam = searchParams.get('conversationId');
    const userState = useSelector((state: RootState) => state.user.user);
    const creatorState = useSelector((state: RootState) => state.creator.creator);
    const currentUser = userState || creatorState;

    const [conversations, setConversations] = useState<ConversationEntity[]>([]);
    const [selectedChat, setSelectedChat] = useState<ConversationEntity | null>(null);
    const [messages, setMessages] = useState<MessageEntity[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const currentUserId = currentUser?.id || (currentUser as unknown as { _id?: string })?._id;

    const fetchConversations = useCallback(async () => {
        try {
            const conversations = await chatService.fetchConversations();
            setConversations(conversations);
        } catch (err: unknown) {
            console.error("Failed to fetch conversations", err);
        }
    }, []);

    const fetchMessages = useCallback(async (convId: string, pageNum = 1) => {
        if (pageNum === 1) {
            setPage(1);
            setHasMore(true);
        }
        try {
            const limit = 20;
            const newMessages = await chatService.fetchMessages(convId, pageNum, limit);

            if (pageNum === 1) {
                setMessages(newMessages);
            } else {
                setMessages(prev => [...newMessages, ...prev]);
            }

            if (newMessages.length < limit) {
                setHasMore(false);
            }
        } catch (err: unknown) {
            console.error("Failed to fetch messages", err);
        }
    }, []);

    const loadMoreMessages = useCallback(async () => {
        if (!selectedChat || !hasMore || isLoadingMore) return;
        const convId = selectedChat.id || (selectedChat as unknown as { _id?: string })._id;
        if (!convId) return;

        setIsLoadingMore(true);
        const nextPage = page + 1;
        await fetchMessages(convId, nextPage);
        setPage(nextPage);
        setIsLoadingMore(false);
    }, [selectedChat, hasMore, isLoadingMore, page, fetchMessages]);

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
            if (currentUser && !selectedChat) {
                // Check for direct conversationId first
                if (conversationIdParam) {
                    const match = conversations.find((c: ConversationEntity) =>
                        (c.id === conversationIdParam || (c as unknown as { _id?: string })._id === conversationIdParam)
                    );
                    if (match) {
                        handleSelectChat(match);
                        return;
                    }
                }

                // Check for bookingId
                if (bookingIdParam) {
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
                }
            }
        };

        if (conversations.length > 0 || bookingIdParam || conversationIdParam) {
            ensureAndSelect();
        }
    }, [conversations, bookingIdParam, conversationIdParam, currentUser, handleSelectChat, selectedChat, fetchConversations]);

    if (!currentUser) return <div className="p-8 text-center text-gray-500 font-sans uppercase tracking-[0.2em] pt-32">Authentication Required</div>;

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col font-sans selection:bg-white selection:text-black overflow-hidden h-screen relative">
            {/* Background Atmospheric Glows */}
            <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
            {userState ? <Navbar scrollToSection={() => { }} /> : <CreatorNavbar />}

            <div className="flex-1 mt-[80px] p-4 md:p-8 flex items-stretch gap-6 overflow-hidden relative z-10">
                {/* Floating Navigation Rail (Sidebar) */}
                <div className={`${isSidebarVisible ? 'flex' : 'hidden md:flex'} w-full md:w-80 lg:w-[450px] flex-col transition-all duration-700 relative`}>
                    <div className="h-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl transition-all hover:bg-white/[0.03] hover:border-white/10 group">
                        <ConversationList
                            conversations={conversations}
                            onSelect={handleSelectChat}
                            selectedId={selectedChat?.id || (selectedChat as unknown as { _id?: string })?._id}
                        />
                    </div>
                </div>

                {/* Main Floating Chat Centerpiece */}
                <div className={`${!isSidebarVisible ? 'flex' : 'hidden md:flex'} flex-1 flex-col relative min-w-0 transition-all duration-700`}>
                    {selectedChat ? (
                        <div className="flex-1 flex flex-col bg-white/[0.02] backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden relative group/chat">
                            {/* Chat Header Header - Integrated Minimalist */}
                            <div className="px-10 py-8 bg-white/[0.01] flex items-center justify-between z-10 border-b border-white/5">
                                <div className="flex items-center gap-6">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setIsSidebarVisible(true)}
                                        className="md:hidden p-3 bg-white/10 rounded-2xl text-white transition-all active:scale-90"
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-[1.8rem] bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl relative z-10 p-0.5 ring-4 ring-white/5 transition-transform duration-700 group-hover/chat:scale-105">
                                            {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT) ? (
                                                selectedChat?.participantDetails?.userImage ? (
                                                    <S3Media s3Key={selectedChat.participantDetails.userImage} className="w-full h-full object-cover rounded-[1.6rem]" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                                        <span className="text-zinc-700 font-black uppercase text-[16px]">{selectedChat?.participantDetails?.userName?.slice(0, 2) || 'US'}</span>
                                                    </div>
                                                )
                                            ) : (
                                                selectedChat?.participantDetails?.creatorImage ? (
                                                    <S3Media s3Key={selectedChat.participantDetails.creatorImage} className="w-full h-full object-cover rounded-[1.6rem]" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                                        <span className="text-zinc-700 font-black uppercase text-[16px]">{selectedChat?.participantDetails?.creatorName?.slice(0, 2) || 'CR'}</span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-[14px] font-black text-white uppercase tracking-[0.4em] mb-1.5 drop-shadow-lg">
                                            {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT)
                                                ? (selectedChat?.participantDetails?.userName || "Client")
                                                : (selectedChat?.participantDetails?.creatorName || "Creative Team")}
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
                                    onLoadMore={loadMoreMessages}
                                    hasMore={hasMore}
                                    isLoading={isLoadingMore}
                                />
                            </div>

                            {/* Message Input - Floating Style inside Inner Padding */}
                            <div className="px-10 pb-10 pt-4 bg-transparent border-t border-white/5">
                                <div className="max-w-5xl mx-auto w-full">
                                    <MessageInput
                                        onSendMessage={handleSendMessage}
                                        onImageSelect={handleImageSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] backdrop-blur-3xl rounded-[3.5rem] border border-white/5 relative group/empty overflow-hidden">
                            {/* Floating Elements Design */}
                            <div className="absolute top-0 right-0 w-64 h-64 border border-white/[0.03] rounded-full -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 border border-white/[0.03] rounded-full -ml-40 -mb-40" />

                            <div className="relative group mb-12">
                                <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full scale-150 group-hover:scale-[2] transition-all duration-1000" />
                                <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center relative shadow-2xl group transition-all duration-700 hover:rotate-12 hover:scale-110">
                                    <svg className="w-12 h-12 text-zinc-100 opacity-20 group-hover:opacity-60 transition-opacity duration-1000" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-6 max-w-sm relative z-10 transition-all duration-700">
                                <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[1em] mb-4">Channel Void</h3>
                                <div className="h-[2px] w-8 bg-white/10 mx-auto" />
                                <p className="text-zinc-600 text-[10px] font-bold leading-[2.5] uppercase tracking-[0.3em] max-w-[280px] mx-auto">
                                    Initiate interaction from your personnel list to bridge the connection.
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

