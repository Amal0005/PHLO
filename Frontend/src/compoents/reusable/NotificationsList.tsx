import React from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationType } from "@/interface/notification/notificationInterface";
import {
    Bell,
    MessageSquare,
    BookOpen,
    Wallet,
    Settings,
    ShieldAlert,
    Circle,
    Inbox
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationsList: React.FC = () => {
    const { notifications, markAsRead } = useNotifications();
    const navigate = useNavigate();

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.CHAT: return <MessageSquare size={20} className="text-blue-500" />;
            case NotificationType.BOOKING: return <BookOpen size={20} className="text-emerald-500" />;
            case NotificationType.WALLET: return <Wallet size={20} className="text-amber-500" />;
            case NotificationType.ACCOUNT: return <Settings size={20} className="text-zinc-500" />;
            case NotificationType.REPORT: return <ShieldAlert size={20} className="text-red-500" />;
            default: return <Bell size={20} />;
        }
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        const isCreator = window.location.pathname.startsWith('/creator');

        if (notification.type === NotificationType.CHAT) {
            navigate(isCreator ? '/creator/chat' : '/chat');
        } else if (notification.type === NotificationType.BOOKING) {
            navigate(isCreator ? '/creator/bookings' : '/bookings');
        } else if (notification.type === NotificationType.REPORT) {
            const isAdmin = window.location.pathname.startsWith('/admin');
            if (isAdmin) {
                navigate('/admin/complaints');
            } else {
                const bookingId = notification.metadata?.bookingId;
                if (bookingId) {
                    navigate(`/bookings/${bookingId}`);
                }
            }
        }
    };

    if (notifications.length === 0) {
        return (
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Inbox size={32} className="text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No notifications yet</h3>
                <p className="text-gray-500 max-w-xs mx-auto">When you receive updates, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/5">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-6 hover:bg-white/[0.03] transition-all cursor-pointer group flex items-start gap-5 ${!n.isRead ? "bg-white/[0.01]" : ""
                            }`}
                    >
                        <div className={`mt-1 p-3 rounded-2xl ${!n.isRead ? "bg-white/10" : "bg-white/5"} group-hover:scale-110 transition-transform shadow-lg`}>
                            {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-1">
                                <h4 className={`text-base font-bold tracking-tight ${!n.isRead ? "text-white" : "text-gray-400"}`}>
                                    {n.title}
                                </h4>
                                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest whitespace-nowrap">
                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed mb-3 font-medium">
                                {n.message}
                            </p>
                            {!n.isRead && (
                                <div className="flex items-center gap-2">
                                    <Circle size={8} className="fill-red-500 text-red-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">New Alert</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsList;
