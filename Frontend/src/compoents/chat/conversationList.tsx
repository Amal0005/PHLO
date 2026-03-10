import { ConversationEntity } from "@/interface/chat/chatInterface";
import { S3Media } from '../reusable/s3Media';

interface Props {
    conversations: ConversationEntity[];
    onSelect: (conv: ConversationEntity) => void;
    selectedId?: string;
}

const ConversationList: React.FC<Props> = ({ conversations, onSelect, selectedId }) => {
    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950">
            <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
                <h1 className="text-sm font-black text-white uppercase tracking-[0.3em]">Discussions</h1>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 opacity-20">
                        <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center mb-4">
                            <span className="text-xs font-bold">!</span>
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-center">No active discussions</p>
                    </div>
                ) : (
                    conversations.map((conv) => {
                        const id = conv.id || (conv as any)._id || (conv.bookingId as any).toString();
                        const isSelected = selectedId === id;

                        return (
                            <div
                                key={id}
                                onClick={() => onSelect(conv)}
                                className={`group p-6 border-b border-zinc-900/50 cursor-pointer transition-all duration-300 relative overflow-hidden ${isSelected
                                    ? 'bg-zinc-900'
                                    : 'hover:bg-zinc-900/50'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                )}

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {window.location.pathname.includes('/creator') ? (
                                            conv.participantDetails?.userImage ? (
                                                <S3Media s3Key={conv.participantDetails.userImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-zinc-600 font-bold uppercase text-[10px]">{conv.participantDetails?.userName?.slice(0, 2) || 'US'}</span>
                                            )
                                        ) : (
                                            conv.participantDetails?.creatorImage ? (
                                                <S3Media s3Key={conv.participantDetails.creatorImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-zinc-600 font-bold uppercase text-[10px]">{conv.participantDetails?.creatorName?.slice(0, 2) || 'CR'}</span>
                                            )
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors truncate pr-2 ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                                                }`}>
                                                {conv.participantDetails ? (
                                                    window.location.pathname.includes('/creator')
                                                        ? conv.participantDetails.userName
                                                        : conv.participantDetails.creatorName
                                                ) : (
                                                    `Ref: ${conv.bookingId.toString().slice(-6)}`
                                                )}
                                            </span>
                                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter flex-shrink-0">
                                                {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>

                                        <p className={`text-xs font-medium truncate leading-tight ${isSelected ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'
                                            }`}>
                                            {conv.lastMessage || 'Channel established...'}
                                        </p>
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
