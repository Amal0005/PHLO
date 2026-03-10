import React, { useEffect, useRef } from 'react';
import { MessageEntity } from "@/interface/chat/chatInterface";

interface Props {
    messages: MessageEntity[];
    currentUserId: string;
}

const ChatWindow: React.FC<Props> = ({ messages, currentUserId }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col h-full bg-black">
            <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Encryption Active</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.senderId.toString() === currentUserId;

                        return (
                            <div
                                key={index}
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] space-y-2 group`}
                                >
                                    <div
                                        className={`px-6 py-4 rounded-[2rem] shadow-2xl transition-all duration-500 ${isMine
                                            ? 'bg-white text-black rounded-tr-none'
                                            : 'bg-zinc-900 text-white border border-zinc-800 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-sm font-medium leading-relaxed tracking-tight break-words whitespace-pre-wrap overflow-hidden">
                                            {msg.message}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>
        </div>
    );
};

export default ChatWindow;
