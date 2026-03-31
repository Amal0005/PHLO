import { useState } from 'react';
import { ConversationEntity } from "@/interface/chat/chatInterface";
import { S3Media } from "@/components/reusable/s3Media";
import { Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface Props {
    conversations: ConversationEntity[];
    onSelect: (conv: ConversationEntity) => void;
    selectedId?: string;
}

const ConversationList: React.FC<Props> = ({ conversations, onSelect, selectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter(conv => {
        const name = window.location.pathname.startsWith(ROUTES.CREATOR.ROOT)
            ? conv.participantDetails?.userName
            : conv.participantDetails?.creatorName;
        return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] pl-1">Discussions</h1>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-3.5 h-3.5 group-focus-within:text-zinc-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH CREATIVES..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3.5 pl-11 pr-5 text-[10px] text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-white/10 focus:bg-zinc-900/80 transition-all font-black tracking-widest uppercase shadow-inner"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth px-3 pb-6">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 opacity-20">
                        <p className="text-[9px] uppercase font-black tracking-[0.4em] text-center text-zinc-500">Silence in the archives</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredConversations.map((conv) => {
                            const id = conv.id || (conv as unknown as { _id?: string })._id || (conv.bookingId as unknown as { toString(): string }).toString();
                            const isSelected = selectedId === id;

                            return (
                                <div
                                    key={id}
                                    onClick={() => onSelect(conv)}
                                    className={`group px-4 py-4 cursor-pointer transition-all duration-300 rounded-[1.5rem] relative mb-1 border ${isSelected ? 'bg-white/[0.03] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : 'hover:bg-white/[0.01] border-transparent hover:border-white/5'}`}
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full ml-1 animate-in slide-in-from-left duration-500" />
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full border overflow-hidden flex-shrink-0 relative transition-all duration-500 ${isSelected ? 'border-white/20 p-0.5 scale-105 ring-4 ring-white/5' : 'border-zinc-800 p-0 shadow-lg'}`}>
                                            {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT) ? (
                                                conv.participantDetails?.userImage ? (
                                                    <S3Media s3Key={conv.participantDetails.userImage} className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full">
                                                        <span className="text-zinc-600 font-black uppercase text-[12px]">{conv.participantDetails?.userName?.slice(0, 2) || 'US'}</span>
                                                    </div>
                                                )
                                            ) : (
                                                conv.participantDetails?.creatorImage ? (
                                                    <S3Media s3Key={conv.participantDetails.creatorImage} className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full">
                                                        <span className="text-zinc-600 font-black uppercase text-[12px]">{conv.participantDetails?.creatorName?.slice(0, 2) || 'CR'}</span>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className={`text-[11px] font-black uppercase tracking-[0.15em] truncate transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                                    {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT)
                                                        ? conv.participantDetails?.userName
                                                        : conv.participantDetails?.creatorName}
                                                </span>
                                                <span className={`text-[8px] font-bold uppercase tracking-widest flex-shrink-0 transition-colors ${isSelected ? 'text-zinc-500' : 'text-zinc-700'}`}>
                                                    {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <div className={`h-1 w-1 rounded-full ${isSelected ? 'bg-zinc-500' : 'bg-zinc-800'}`} />
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest truncate ${isSelected ? 'text-zinc-500' : 'text-zinc-700'}`}>
                                                        {conv.packageName || 'ENGAGEMENT'}
                                                    </span>
                                                </div>
                                                <p className={`text-[12px] font-medium truncate tracking-tight ${isSelected ? 'text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
                                                    {conv.lastMessage || 'Channel established...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
