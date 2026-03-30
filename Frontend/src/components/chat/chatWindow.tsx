import React, { useEffect, useRef, useState } from 'react';
import { MessageEntity } from "@/interface/chat/chatInterface";
import { S3Media } from "@/components/reusable/s3Media";
import { format, isToday, isYesterday } from 'date-fns';
import { X } from 'lucide-react';

interface Props {
    messages: MessageEntity[];
    currentUserId: string;
    recipientName?: string;
    recipientImage?: string;
}

const ChatWindow: React.FC<Props> = ({ messages, currentUserId, recipientName, recipientImage }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        <div className="flex-1 flex flex-col h-full bg-transparent">
            <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto space-y-4 custom-scrollbar no-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Secure Channel Active</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.senderId.toString() === currentUserId;
                        const date = msg.createdAt ? new Date(msg.createdAt) : new Date();
                        const prevDate = index > 0 && messages[index - 1].createdAt ? new Date(messages[index - 1].createdAt!) : undefined;

                        return (
                            <React.Fragment key={index}>
                                {renderDateHeader(date, prevDate)}
                                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                                    {!isMine && (
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0 mb-1">
                                            {recipientImage ? (
                                                <S3Media s3Key={recipientImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                    <span className="text-zinc-600 font-bold uppercase text-[8px]">{recipientName?.slice(0, 2) || 'CR'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] space-y-1`}>
                                        <div
                                            className={`px-5 py-3 shadow-xl transition-all duration-300 ${isMine
                                                ? 'bg-[#004D5C] text-zinc-100 rounded-[1.5rem] rounded-br-none'
                                                : 'bg-[#2A2A2A] text-zinc-200 rounded-[1.5rem] rounded-bl-none border border-white/5'
                                                }`}
                                        >
                                            <div className="text-[12px] font-medium leading-relaxed tracking-tight break-words">
                                                {msg.type === "image" ? (
                                                    <div 
                                                        className="rounded-xl overflow-hidden border border-white/5 max-w-[280px] cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => setPreviewUrl(msg.message)}
                                                    >
                                                        <S3Media s3Key={msg.message} className="w-full h-auto object-contain" />
                                                    </div>
                                                ) : (
                                                    msg.message
                                                )}
                                            </div>
                                        </div>
                                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-2 items-center gap-2`}>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                                                {format(date, 'hh:mm a')}
                                            </span>
                                            {isMine && (
                                                <span className={`text-[8px] font-black uppercase tracking-tighter opacity-80 ${msg.seen ? 'text-[#00E5FF]' : 'text-zinc-600'}`}>
                                                    {msg.seen ? 'Seen' : 'Sent'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={scrollRef} />
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
