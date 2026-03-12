import React, { useState, useRef, useEffect } from 'react';
import { Smile, Sparkles } from 'lucide-react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

interface Props {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setText(prev => prev + emojiData.emoji);
        // Do not close picker automatically to allow multiple emojis
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
            setShowEmojiPicker(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full group relative">
            {/* Emoji Picker Container */}
            {showEmojiPicker && (
                <div 
                    ref={pickerRef}
                    className="absolute bottom-full right-0 mb-4 z-[9999] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                    <EmojiPicker 
                        theme={Theme.DARK}
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                        width={320}
                        height={400}
                        skinTonesDisabled
                        searchPlaceholder="Search emoji..."
                    />
                </div>
            )}

            <div className="relative flex-1">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-[#1A1A1A] text-zinc-200 text-[13px] font-medium tracking-wide py-4 pl-6 pr-14 rounded-[1.2rem] border border-white/5 focus:outline-none focus:border-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                />
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-zinc-500">
                    <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`hover:text-zinc-200 transition-colors ${showEmojiPicker ? 'text-zinc-100 scale-110' : ''}`}
                    >
                        <Smile size={18} />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#333333] disabled:opacity-30 disabled:grayscale transition-all py-3.5 px-6 rounded-full border border-white/10 text-white shadow-xl group/btn active:scale-95"
            >
                <span className="text-[12px] font-black uppercase tracking-widest">Send</span>
                <Sparkles size={16} className="text-white group-hover/btn:rotate-12 transition-transform" />
            </button>
        </form>
    );
};

export default MessageInput;
