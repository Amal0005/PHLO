import React, { useEffect, useRef } from 'react';
import { MessageEntity } from "@/interface/chat/chatInterface";
import { S3Media } from '../reusable/s3Media';
import { format, isToday, isYesterday } from 'date-fns';

interface Props {
    messages: MessageEntity[];
    currentUserId: string;
    recipientName?: string;
    recipientImage?: string;
}

const ChatWindow: React.FC<Props> = ({ messages, currentUserId, recipientName, recipientImage }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

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
                                            <p className="text-[12px] font-medium leading-relaxed tracking-tight break-words">
                                                {msg.message}
                                            </p>
                                        </div>
                                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-2`}>
                                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                                                {format(date, 'hh:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>
        </div>
    );
};

export default ChatWindow;
