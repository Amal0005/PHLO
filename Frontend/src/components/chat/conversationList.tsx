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
        <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
            <div className="p-5 space-y-4">
                <h1 className="text-[13px] font-black text-zinc-300 uppercase tracking-widest pl-1">Discussions</h1>
                
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 group-focus-within:text-zinc-300 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#121212] border border-zinc-800/50 rounded-lg py-2 pl-9 pr-4 text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar scroll-smooth">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 opacity-20">
                        <p className="text-[10px] uppercase font-black tracking-widest text-center text-zinc-500">No active discussions</p>
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const id = conv.id || (conv as unknown as { _id?: string })._id || (conv.bookingId as unknown as { toString(): string }).toString();
                        const isSelected = selectedId === id;

                        return (
                            <div
                                key={id}
                                onClick={() => onSelect(conv)}
                                className={`group px-5 py-4 cursor-pointer transition-all duration-200 relative ${isSelected ? 'bg-[#3E3E3E]/60' : 'hover:bg-zinc-800/40'}`}
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/50 overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                                        {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT) ? (
                                            conv.participantDetails?.userImage ? (
                                                <S3Media s3Key={conv.participantDetails.userImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                    <span className="text-zinc-600 font-bold uppercase text-[10px]">{conv.participantDetails?.userName?.slice(0, 2) || 'US'}</span>
                                                </div>
                                            )
                                        ) : (
                                            conv.participantDetails?.creatorImage ? (
                                                <S3Media s3Key={conv.participantDetails.creatorImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                    <span className="text-zinc-600 font-bold uppercase text-[10px]">{conv.participantDetails?.creatorName?.slice(0, 2) || 'CR'}</span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[12px] font-black uppercase tracking-wider truncate transition-colors ${isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
                                                {window.location.pathname.startsWith(ROUTES.CREATOR.ROOT)
                                                    ? conv.participantDetails?.userName
                                                    : conv.participantDetails?.creatorName}
                                            </span>
                                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter flex-shrink-0 mt-0.5 ml-2">
                                                {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-0.5 mt-0.5">
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter whitespace-nowrap opacity-60">Package :</span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight truncate">
                                                    {conv.packageName || 'Portrait Session'}
                                                </span>
                                            </div>
                                            <p className={`text-[11px] font-medium truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                                                {conv.lastMessage || 'Channel established...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
