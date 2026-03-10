import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Props {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Compose message..."
                className="w-full bg-zinc-900/50 backdrop-blur-3xl text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] py-4 pl-6 pr-16 rounded-[1.5rem] border border-white/5 focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700"
            />
            <button
                type="submit"
                disabled={!text.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-[1.2rem] hover:bg-zinc-200 transition-all active:scale-90 disabled:opacity-10 disabled:grayscale group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
        </form>
    );
};

export default MessageInput;
