import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import api from '@/axios/axiosConfig';
import { socketService } from '../../../services/socketService';
import ConversationList from '../../../compoents/chat/conversationList';
import ChatWindow from '../../../compoents/chat/chatWindow';
import MessageInput from '../../../compoents/chat/messageInput';
import { ConversationEntity, MessageEntity } from "@/interface/chat/chatInterface";
import Navbar from "@/compoents/reusable/userNavbar";
import CreatorNavbar from "@/compoents/reusable/creatorNavbar";
import { S3Media } from '@/compoents/reusable/s3Media';

const ChatPage = () => {
    const [searchParams] = useSearchParams();
    const bookingIdParam = searchParams.get('bookingId');
    const userState = useSelector((state: any) => state.user.user);
    const creatorState = useSelector((state: any) => state.creator.creator);
    const currentUser = userState || creatorState;

    const [conversations, setConversations] = useState<ConversationEntity[]>([]);
    const [selectedChat, setSelectedChat] = useState<ConversationEntity | null>(null);
    const [messages, setMessages] = useState<MessageEntity[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); // For mobile responsiveness

    const currentUserId = currentUser?.id || currentUser?._id;

    // 1. Connect socket and fetch conversations once on mount / user change
    useEffect(() => {
        if (!currentUserId) return;
        socketService.connect(currentUserId);
        fetchConversations();

        // Only disconnect on full unmount
        return () => socketService.disconnect();
    }, [currentUser]);

    // 2. Register receive-message listener separately so it has latest selectedChat ref
    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) return;

        const handleReceive = (newMessage: MessageEntity) => {
            console.log("Received new message via socket:", newMessage);
            // Check if the message belongs to the currently open chat
            const selectedId = (selectedChat?.id || (selectedChat as any)?._id)?.toString();
            const messageConvId = newMessage.conversationId?.toString();

            if (selectedId && messageConvId === selectedId) {
                setMessages((prev: MessageEntity[]) => {
                    // Prevent duplicate messages if socket and API both update
                    const exists = prev.some(m => (m.id || (m as any)._id)?.toString() === (newMessage.id || (newMessage as any)._id)?.toString());
                    if (exists) return prev;
                    return [...prev, newMessage];
                });
            }
            fetchConversations();
        };

        socket.on("receive-message", handleReceive);
        return () => {
            socket.off("receive-message", handleReceive);
        };
    }, [selectedChat, socketService.getSocket()]);

    // Handle initial selection via query param
    useEffect(() => {
        const ensureAndSelect = async () => {
            if (bookingIdParam && currentUser && !selectedChat) {
                try {
                    // Try to find in existing list first
                    const match = conversations.find((c: ConversationEntity) => c.bookingId === bookingIdParam);
                    if (match) {
                        handleSelectChat(match);
                        return;
                    }

                    // If not found, ensure it exists on backend
                    const res = await api.get(`/chat/ensure-conversation/${bookingIdParam}`);
                    if (res.data.success && res.data.conversation) {
                        const newConv = res.data.conversation;
                        // Map to frontend interface if needed (backend already does mapping usually)
                        const mappedConv = {
                            ...newConv,
                            id: newConv.id || (newConv as any)._id
                        };

                        // Reload list to include it
                        await fetchConversations();
                        handleSelectChat(mappedConv);
                    }
                } catch (err) {
                    console.error("Failed to ensure conversation", err);
                }
            }
        };

        if (conversations.length > 0 || bookingIdParam) {
            ensureAndSelect();
        }
    }, [conversations, bookingIdParam, currentUser]);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations');
            setConversations(res.data.conversation || []);
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    const fetchMessages = async (convId: string) => {
        try {
            const res = await api.get(`/chat/messages/${convId}`);
            setMessages(res.data.message || []);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSelectChat = (conv: ConversationEntity) => {
        setSelectedChat(conv);
        setIsSidebarVisible(false); // Hide sidebar on mobile when chat is selected
        const convId = conv.id || (conv as any)._id;
        if (convId) {
            fetchMessages(convId);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!selectedChat || !currentUserId) return;
        const conversationId = selectedChat.id || (selectedChat as any)._id;
        if (!conversationId) return;

        // More robust receiverId extraction
        const receiverId = selectedChat.participants
            .map((p: any) => (typeof p === 'object' ? (p._id || p.id) : p)?.toString())
            .find((id: string) => id !== currentUserId.toString());

        if (!receiverId) {
            console.error("Could not determine receiverId", selectedChat.participants);
            return;
        }

        const payload = {
            message: text,
            receiverId
        };

        // 1. Emit via socket for real-time
        const socket = socketService.getSocket();
        if (socket?.connected) {
            socket.emit("send-message", {
                ...payload,
                conversationId,
                senderId: currentUserId,
                createdAt: new Date()
            });
        } else {
            console.warn("Socket not connected, real-time message might not be sent");
        }

        try {
            // 2. Save to database
            const res = await api.post('/chat/message', {
                ...payload,
                conversationId
            });

            // 3. Update local UI (sender side)
            setMessages((prev: MessageEntity[]) => {
                const exists = prev.some(m => (m.id || (m as any)._id)?.toString() === (res.data.message.id || (res.data.message as any)._id)?.toString());
                if (exists) return prev;
                return [...prev, res.data.message];
            });
            fetchConversations(); // Update last message in list
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    if (!currentUser) return <div className="p-8 text-center text-gray-500 font-sans uppercase tracking-[0.2em] pt-32">Authentication Required</div>;

    return (
        <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-white selection:text-black overflow-hidden h-screen">
            {userState ? <Navbar scrollToSection={() => { }} /> : <CreatorNavbar />}

            <div className="flex-1 flex mt-[80px] overflow-hidden relative">
                {/* Conversations Sidebar */}
                <div className={`${isSidebarVisible ? 'flex' : 'hidden md:flex'} w-full md:w-80 lg:w-96 border-r border-zinc-900 bg-zinc-950 flex flex-col transition-all duration-300 z-20`}>
                    <ConversationList
                        conversations={conversations}
                        onSelect={handleSelectChat}
                        selectedId={selectedChat?.id || (selectedChat as any)?._id}
                    />
                </div>

                {/* Main Chat Area */}
                <div className={`${!isSidebarVisible ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-black relative`}>
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-4 py-4 md:px-8 md:py-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-2xl flex items-center justify-between z-10">
                                <div className="flex items-center gap-3 md:gap-4">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setIsSidebarVisible(true)}
                                        className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center ring-2 ring-white/5 ring-offset-2 ring-offset-black">
                                        {window.location.pathname.includes('/creator') ? (
                                            selectedChat.participantDetails?.userImage ? (
                                                <S3Media s3Key={selectedChat.participantDetails.userImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-zinc-600 font-black uppercase text-[10px]">{selectedChat.participantDetails?.userName?.slice(0, 2) || 'US'}</span>
                                            )
                                        ) : (
                                            selectedChat.participantDetails?.creatorImage ? (
                                                <S3Media s3Key={selectedChat.participantDetails.creatorImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-zinc-600 font-black uppercase text-[10px]">{selectedChat.participantDetails?.creatorName?.slice(0, 2) || 'CR'}</span>
                                            )
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.15em] truncate max-w-[150px] md:max-w-none">
                                            {window.location.pathname.includes('/creator')
                                                ? (selectedChat.participantDetails?.userName || "Client")
                                                : (selectedChat.participantDetails?.creatorName || "Creator")}
                                        </h2>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Active session</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="hidden sm:flex p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-zinc-400 group">
                                        <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Messages Window */}
                            <div className="flex-1 overflow-hidden relative">
                                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none opacity-50" />
                                <ChatWindow messages={messages} currentUserId={currentUserId!} />
                                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none opacity-50" />
                            </div>

                            {/* Message Input */}
                            <div className="px-4 py-6 md:px-8 md:py-8 bg-zinc-950/30 backdrop-blur-md">
                                <div className="max-w-4xl mx-auto w-full">
                                    <MessageInput onSendMessage={handleSendMessage} />
                                </div>
                            </div>
                        </>
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
                                <h3 className="text-white text-base md:text-lg font-black uppercase tracking-[0.4em] translate-x-1">Secure Channel</h3>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-[1px] w-8 bg-zinc-800" />
                                    <p className="text-zinc-600 text-[10px] md:text-xs font-black leading-relaxed uppercase tracking-[0.2em]">
                                        End-to-end encrypted
                                    </p>
                                    <div className="h-[1px] w-8 bg-zinc-800" />
                                </div>
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
