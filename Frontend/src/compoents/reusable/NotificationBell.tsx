import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, BookOpen, Wallet, Settings, ShieldAlert, Circle, Check } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationType } from "../../interface/notification/notificationInterface";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
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

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        setIsOpen(false);

        const isAdmin = window.location.pathname.startsWith('/admin');
        const isCreator = window.location.pathname.startsWith('/creator');

        if (notification.type === NotificationType.CHAT) {
            navigate(isCreator ? '/creator/chat' : '/chat');
        } else if (notification.type === NotificationType.ACCOUNT) {
            if (isAdmin) {
                if (notification.title.includes("Creator")) {
                    navigate('/admin/creators');
                } else if (notification.title.includes("Wallpaper")) {
                    navigate('/admin/wallpapers');
                }
            } else {
                navigate(isCreator ? '/creator/profile' : '/profile');
            }
        } else if (notification.type === NotificationType.BOOKING) {
            navigate(isCreator ? '/creator/bookings' : '/bookings');
        } else if (notification.type === NotificationType.WALLET) {
            if (isAdmin) {
                navigate('/admin/wallet');
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-all hover:scale-110"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-black">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Activity</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAllAsRead();
                                    }}
                                    className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="flex p-1 bg-white/5 rounded-xl">
                            <button
                                onClick={() => setActiveTab("unread")}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === "unread" ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                Unread {unreadCount > 0 && `(${unreadCount})`}
                            </button>
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === "all" ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                All
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell size={20} className="text-zinc-700" />
                                </div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                    {activeTab === "unread" ? "No new alerts" : "No activity yet"}
                                </p>
                            </div>
                        ) : (
                            filteredNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`w-full p-4 text-left hover:bg-white/[0.03] transition-colors border-b border-white/5 flex items-start gap-3 group cursor-pointer ${!n.isRead ? "bg-white/[0.01]" : ""}`}
                                >
                                    <div className={`mt-1 p-2 rounded-lg ${!n.isRead ? "bg-white/10" : "bg-white/5"} group-hover:scale-110 transition-transform`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className={`text-[11px] font-black uppercase tracking-wider truncate ${!n.isRead ? "text-white" : "text-gray-400"}`}>
                                                {n.title}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(n.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all"
                                                        title="Dismiss"
                                                    >
                                                        <Check size={12} className="text-gray-400 hover:text-white" />
                                                    </button>
                                                )}
                                                {!n.isRead && <Circle size={6} className="fill-red-500 text-red-500" />}
                                            </div>
                                        </div>
                                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-1.5 font-medium">
                                            {n.message}
                                        </p>
                                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
