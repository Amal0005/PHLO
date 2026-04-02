import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, BookOpen, Wallet, Settings, ShieldAlert, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType, NotificationEntity } from "@/interface/notification/notificationInterface";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { formatDistanceToNow } from "date-fns";

interface NotificationBellProps {
    onTrigger?: () => void;
    onClose?: () => void;
    forceOpen?: boolean;
    mobileMode?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onTrigger, onClose, forceOpen, mobileMode }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchMore } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleToggle = () => {
        if (onTrigger) {
            onTrigger();
            return;
        }
        setIsOpen(!isOpen);
    };

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50 && !isLoadingMore && hasMore) {
            setIsLoadingMore(true);
            const moreData = await fetchMore(page + 1);
            if (moreData) {
                setPage(page + 1);
            } else {
                setHasMore(false);
            }
            setIsLoadingMore(false);
        }
    };

    const activeOpen = (isOpen || forceOpen);
    const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredNotifications = activeTab === "unread"
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.CHAT: return <MessageSquare size={16} className="text-blue-500" />;
            case NotificationType.BOOKING: return <BookOpen size={16} className="text-emerald-500" />;
            case NotificationType.WALLET: return <Wallet size={16} className="text-amber-500" />;
            case NotificationType.ACCOUNT: return <Settings size={16} className="text-zinc-500" />;
            case NotificationType.REPORT: return <ShieldAlert size={16} className="text-red-500" />;
            default: return <Bell size={16} />;
        }
    };

    const handleNotificationClick = (notification: NotificationEntity) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
        if (onClose) onClose();

        const isAdmin = window.location.pathname.startsWith(ROUTES.ADMIN.ROOT);
        const isCreator = window.location.pathname.startsWith(ROUTES.CREATOR.ROOT);

        if (notification.type === NotificationType.CHAT) {
            const conversationId = notification.metadata?.conversationId;
            const bookingId = notification.metadata?.bookingId;

            let chatPath = isCreator ? ROUTES.CREATOR.CHAT : ROUTES.USER.CHAT;
            if (conversationId) {
                chatPath += `?conversationId=${conversationId}`;
            } else if (bookingId) {
                chatPath += `?bookingId=${bookingId}`;
            }

            navigate(chatPath);
        } else if (notification.type === NotificationType.ACCOUNT) {
            if (isAdmin) {
                if (notification.title.includes("Creator")) {
                    navigate(ROUTES.ADMIN.CREATORS);
                } else if (notification.title.includes("Wallpaper")) {
                    navigate(ROUTES.ADMIN.WALLPAPERS);
                }
            } else {
                navigate(isCreator ? ROUTES.CREATOR.PROFILE : ROUTES.USER.PROFILE);
            }
        } else if (notification.type === NotificationType.BOOKING) {
            navigate(isCreator ? ROUTES.CREATOR.BOOKINGS : ROUTES.USER.BOOKINGS);
        } else if (notification.type === NotificationType.WALLET) {
            if (isAdmin) {
                navigate(ROUTES.ADMIN.WALLET);
            }
        } else if (notification.type === NotificationType.REPORT) {
            if (isAdmin) {
                navigate(ROUTES.ADMIN.COMPLAINTS);
            } else {
                const bookingId = notification.metadata?.bookingId;
                if (bookingId) {
                    navigate(`${ROUTES.USER.BOOKINGS}/${String(bookingId)}`);
                }
            }
        }
    };

    return (
        <div className={mobileMode ? "w-full" : "relative"} ref={mobileMode ? null : dropdownRef}>
            {!mobileMode && (
                <button
                    onClick={handleToggle}
                    className="relative p-2.5 text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95 group"
                >
                    <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform blur-md" />
                    <Bell size={20} className="relative z-10" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-4 ring-black/50 z-20">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            )}

            {activeOpen && (
                <div className={mobileMode
                    ? "w-full bg-transparent flex flex-col space-y-4"
                    : "fixed inset-x-4 top-20 bottom-10 md:absolute md:inset-auto md:right-0 md:mt-4 md:w-96 md:bottom-auto bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[100] transition-all flex flex-col"
                }>
                    {!mobileMode && (
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes slideInUp {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                            }
                            .notif-item-animate {
                            animation: slideInUp 0.4s ease-out forwards;
                            opacity: 0;
                            }
                        `}} />
                    )}

                    {!mobileMode && (
                        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                                        <Bell size={14} className="text-white" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Notifications</h3>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAllAsRead();
                                        }}
                                        className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-all border-b border-transparent hover:border-rose-500/50"
                                    >
                                        Read All
                                    </button>
                                )}
                            </div>

                            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                                <button
                                    onClick={() => setActiveTab("unread")}
                                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all duration-300 ${activeTab === "unread" ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]" : "text-zinc-500 hover:text-white"}`}
                                >
                                    Unread {unreadCount > 0 && <span className="ml-1 opacity-50 px-1.5 py-0.5 bg-black/20 rounded-full">{unreadCount}</span>}
                                </button>
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[1rem] transition-all duration-300 ${activeTab === "all" ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]" : "text-zinc-500 hover:text-white"}`}
                                >
                                    All History
                                </button>
                            </div>
                        </div>
                    )}

                    <div
                        onScroll={handleScroll}
                        className={mobileMode ? "flex-1 overflow-y-auto custom-scrollbar" : "max-h-[480px] overflow-y-auto custom-scrollbar"}
                    >
                        {filteredNotifications.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-white/[0.02] rounded-3xl flex items-center justify-center mx-auto mb-5 border border-white/5 rotate-12 group hover:rotate-0 transition-transform duration-500">
                                    <Bell size={24} className="text-zinc-800" />
                                </div>
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] max-w-[150px] mx-auto leading-relaxed">
                                    {activeTab === "unread" ? "The atmosphere is calm. No new alerts." : "Your notification journey starts here."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.03]">
                                {filteredNotifications.map((n, idx) => (
                                    <div
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`w-full p-6 text-left hover:bg-white/[0.03] transition-all flex items-start gap-5 group cursor-pointer notif-item-animate ${!n.isRead ? "bg-white/[0.01]" : ""}`}
                                        style={{ animationDelay: `${idx * 50}ms`, opacity: 1, transform: 'translateY(0)' }}
                                    >
                                        <div className={`mt-0.5 p-3 rounded-2xl border transition-all duration-500 ${!n.isRead
                                            ? "bg-white/10 border-white/20 scale-110 shadow-[0_5px_15px_rgba(255,255,255,0.05)]"
                                            : "bg-white/5 border-transparent grayscale group-hover:grayscale-0 group-hover:bg-white/10"
                                            }`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-3 mb-1.5">
                                                <p className={`text-[11px] font-black uppercase tracking-wider truncate mb-0.5 ${!n.isRead ? "text-white" : "text-zinc-500"}`}>
                                                    {n.title}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {!n.isRead && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`text-xs leading-relaxed mb-3 font-medium transition-colors ${!n.isRead ? "text-zinc-400" : "text-zinc-600 line-clamp-2"}`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </p>
                                                {!n.isRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(n.id);
                                                        }}
                                                        className={`flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-[9.5px] font-black uppercase tracking-widest text-white border border-white/10 ${mobileMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                                    >
                                                        Mark as Read <Check size={9} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoadingMore && (
                                    <div className="p-8 flex justify-center items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                )}
                                {!hasMore && filteredNotifications.length > 0 && (
                                    <div className="p-8 text-center">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-800">End of activity</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tray Footer Visual Glow */}
                    <div className="p-3 bg-white/[0.01] border-t border-white/5 relative">
                        <div className="absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                        <div className="text-center">
                            <div className="w-12 h-1 bg-zinc-900 rounded-full mx-auto" />
                        </div>
                    </div>
                </div>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}} />
        </div>
    );
};

export default NotificationBell;
