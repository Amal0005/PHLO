import React, { useState, useRef, useEffect } from 'react';
import { Smile, Sparkles, Image as ImageIcon } from 'lucide-react';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

interface Props {
    onSendMessage: (text: string) => void;
    onImageSelect: (file: File) => void;
}

const MessageInput: React.FC<Props> = ({ onSendMessage, onImageSelect }) => {
    const [text, setText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '0px';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
        }
    }, [text]);

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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
            setShowEmojiPicker(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-3 w-full group relative">
            {/* Emoji Picker Container */}
            {showEmojiPicker && (
                <div
                    ref={pickerRef}
                    className="absolute bottom-[calc(100%+1rem)] right-0 z-[9999] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
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
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Compose message..."
                    rows={1}
                    className="w-full bg-zinc-900/50 backdrop-blur-xl text-zinc-200 text-[13px] font-medium tracking-wide py-5 pl-8 pr-24 rounded-[2rem] border border-white/5 focus:outline-none focus:border-white/10 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 shadow-2xl resize-none min-h-[64px] custom-scrollbar overflow-hidden"
                />

                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4 text-zinc-600">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 hover:text-zinc-200 transition-all hover:scale-110 active:scale-90"
                    >
                        <ImageIcon size={18} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onImageSelect(file);
                            e.target.value = '';
                        }}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-1 hover:text-zinc-200 transition-all hover:scale-110 active:scale-90 ${showEmojiPicker ? 'text-zinc-100 scale-125' : ''}`}
                    >
                        <Smile size={18} />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={!text.trim()}
                className="flex items-center justify-center bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:opacity-20 transition-all rounded-full border border-white/10 text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] group/btn active:scale-90 h-[64px] w-[64px] flex-shrink-0"
            >
                <Sparkles size={20} className="group-hover/btn:rotate-12 transition-transform" />
            </button>
        </form>
    );
};

export default MessageInput;
