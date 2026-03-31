import React, { useEffect, useRef, useState } from 'react';
import { MessageEntity } from "@/interface/chat/chatInterface";
import { S3Media } from "@/components/reusable/s3Media";
import { format, isToday, isYesterday } from 'date-fns';
import { X } from 'lucide-react';
import logo from "@/assets/images/Logo_white.png";

interface Props {
    messages: MessageEntity[];
    currentUserId: string;
    recipientName?: string;
    recipientImage?: string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
}

const ChatWindow: React.FC<Props> = ({ messages, currentUserId, recipientName, recipientImage, onLoadMore, hasMore, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    useEffect(() => {
        setPrevScrollHeight(0);
    }, [recipientName, recipientImage]);

    // Initial scroll to bottom and scroll to bottom on new messages
    useEffect(() => {
        if (!isLoading && prevScrollHeight === 0) {
            scrollRef.current?.scrollIntoView({ behavior: 'auto' });
        } else if (!isLoading && containerRef.current) {
            // Restore scroll position after loading older messages
            const newScrollHeight = containerRef.current.scrollHeight;
            containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
    }, [messages, isLoading, prevScrollHeight]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading && onLoadMore) {
                    if (containerRef.current) {
                        setPrevScrollHeight(containerRef.current.scrollHeight);
                    }
                    onLoadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    // Handle smooth scroll for strictly NEW messages at bottom
    useEffect(() => {
        if (prevScrollHeight !== 0) return;
        const isNearBottom = containerRef.current && (containerRef.current.scrollHeight - containerRef.current.scrollTop - containerRef.current.clientHeight < 100);
        if (isNearBottom) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, prevScrollHeight]);

    const renderDateHeader = (date: Date, prevDate?: Date) => {
        if (!prevDate || format(date, 'yyyy-MM-dd') !== format(prevDate, 'yyyy-MM-dd')) {
            let label = format(date, 'MMMM d, yyyy');
            if (isToday(date)) label = 'Today';
            else if (isYesterday(date)) label = 'Yesterday';

            return (
                <div className="flex justify-center my-8">
                    <span className="bg-[#2A2A2A] px-5 py-1.5 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border border-white/5">
                        {label}
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden">
            {/* Background Logo with enhanced subtlety */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <img
                    src={logo}
                    alt="PHLO Logo"
                    className="w-[600px] md:w-[800px] object-contain opacity-[0.03] scale-110"
                />
            </div>

            <div
                ref={containerRef}
                className="flex-1 px-4 md:px-10 py-8 overflow-y-auto space-y-6 custom-scrollbar no-scrollbar relative z-10 scroll-smooth"
            >
                {/* Infinite Scroll Sentinel */}
                <div ref={sentinelRef} className="h-4 flex items-center justify-center">
                    {isLoading && (
                        <div className="flex space-x-2 animate-pulse mb-8">
                            <div className="h-1.5 w-1.5 bg-zinc-700 rounded-full" />
                            <div className="h-1.5 w-1.5 bg-zinc-700 rounded-full" style={{ animationDelay: '0.2s' }} />
                            <div className="h-1.5 w-1.5 bg-zinc-700 rounded-full" style={{ animationDelay: '0.4s' }} />
                        </div>
                    )}
                </div>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-[1px] bg-white/10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600 animate-pulse">Connection Established</p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-800">End-to-end encrypted channel</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            const isMine = msg.senderId.toString() === currentUserId;
                            const date = msg.createdAt ? new Date(msg.createdAt) : new Date();
                            const prevDate = index > 0 && messages[index - 1].createdAt ? new Date(messages[index - 1].createdAt!) : undefined;

                            return (
                                <React.Fragment key={index}>
                                    {renderDateHeader(date, prevDate)}
                                    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                        {!isMine && (
                                            <div className="w-9 h-9 rounded-full border border-zinc-800 overflow-hidden flex-shrink-0 mb-1 shadow-lg">
                                                {recipientImage ? (
                                                    <S3Media s3Key={recipientImage} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                                                        <span className="text-zinc-700 font-black uppercase text-[10px]">{recipientName?.slice(0, 2) || 'CR'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] md:max-w-[65%] space-y-1.5 min-w-0`}>
                                            <div
                                                className={`px-6 py-4 shadow-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-md ${isMine
                                                    ? 'bg-gradient-to-br from-[#005a6b] to-[#003d4a] text-zinc-50 rounded-[2rem] rounded-br-[0.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/5'
                                                    : 'bg-zinc-900/80 text-zinc-200 rounded-[2rem] rounded-bl-[0.5rem] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)]'
                                                    }`}
                                            >
                                                <div className="text-[13px] font-medium leading-relaxed tracking-wide whitespace-pre-wrap [overflow-wrap:anywhere] break-words [word-break:break-word] text-left">
                                                    {msg.type === "image" ? (
                                                        <div
                                                            className="rounded-2xl overflow-hidden border border-white/10 max-w-full md:max-w-[320px] cursor-pointer hover:opacity-95 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                                                            onClick={() => setPreviewUrl(msg.message)}
                                                        >
                                                            <S3Media s3Key={msg.message} className="w-full h-auto object-contain" />
                                                        </div>
                                                    ) : (
                                                        msg.message
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-3 items-center gap-3 mt-1`}>
                                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest opacity-80">
                                                    {format(date, 'hh:mm a')}
                                                </span>
                                                {isMine && (
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`h-1 w-1 rounded-full ${msg.seen ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-zinc-800'}`} />
                                                        <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${msg.seen ? 'text-cyan-400' : 'text-zinc-800'}`}>
                                                            {msg.seen ? 'Seen' : 'Delivered'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
                <div ref={scrollRef} className="h-4" />
            </div>

            {/* Image Preview Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setPreviewUrl(null)}
                >
                    <button
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white transition-all hover:scale-110 active:scale-90 z-[10000]"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative w-full max-w-5xl h-full flex items-center justify-center pointer-events-none">
                        <S3Media
                            s3Key={previewUrl}
                            className="max-w-full max-h-full object-contain pointer-events-auto rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
