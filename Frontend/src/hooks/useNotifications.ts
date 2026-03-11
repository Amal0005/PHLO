import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
    addNotification,
    setNotifications,
    setUnreadCount,
    markRead,
    markAllAsRead
} from "../store/slices/notification/notificationSlice";
import api from "../axios/axiosConfig";
import { socketService } from "../services/socketService";
import { NotificationEntity, NotificationType } from "../interface/notification/notificationInterface";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useNotifications = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
    const user = useSelector((state: RootState) => state.user.user);
    const creator = useSelector((state: RootState) => state.creator.creator);
    const admin = useSelector((state: RootState) => state.admin.admin);
    const navigate = useNavigate();
    const currentUserId = user?.id || user?._id || creator?.id || creator?._id || admin?.id || admin?._id;

    const fetchNotifications = useCallback(async () => {
        if (!currentUserId) return;
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get("/notifications"),
                api.get("/notifications/unread-count")
            ]);

            if (notifRes.data.success) {
                dispatch(setNotifications(notifRes.data.notifications));
            }
            if (countRes.data.success) {
                dispatch(setUnreadCount(countRes.data.count));
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [currentUserId, dispatch]);

    const markAsRead = async (notificationId: string) => {
        try {
            const res = await api.patch(`/notifications/mark-read/${notificationId}`);
            if (res.data.success) {
                dispatch(markRead(notificationId));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            const res = await api.patch("/notifications/mark-all-read");
            if (res.data.success) {
                dispatch(markAllAsRead());
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    useEffect(() => {
        if (!currentUserId) return;

        fetchNotifications();

        // Connect/Re-connect to ensure socket is ready for this specific user room
        socketService.connect(currentUserId);
        const socket = socketService.getSocket();

        if (socket) {
            const handleNotification = (notification: NotificationEntity) => {
                dispatch(addNotification(notification));
                // Show toast
                toast.info(`${notification.title}: ${notification.message}`, {
                    position: "bottom-right",
                    autoClose: 4000,
                    className: "bg-zinc-900 text-white rounded-2xl border border-white/10 shadow-2xl",
                    progressClassName: "bg-blue-500",
                    onClick: () => {
                        const isAdmin = window.location.pathname.startsWith('/admin');
                        const isCreator = window.location.pathname.startsWith('/creator');

                        if (notification.type === NotificationType.CHAT) {
                            navigate(isCreator ? '/creator/chat' : '/chat');
                        } else if (notification.type === NotificationType.BOOKING) {
                            navigate(isCreator ? '/creator/bookings' : '/bookings');
                        } else if (notification.type === NotificationType.ACCOUNT) {
                            if (isAdmin) {
                                if (notification.title.includes("Creator")) navigate('/admin/creators');
                                else if (notification.title.includes("Wallpaper")) navigate('/admin/wallpapers');
                            } else {
                                navigate(isCreator ? '/creator/profile' : '/profile');
                            }
                        } else if (notification.type === NotificationType.WALLET) {
                            if (isAdmin) navigate('/admin/wallet');
                        }
                    }
                });
            };

            socket.on("notification", handleNotification);

            return () => {
                socket.off("notification", handleNotification);
                // We keep the socket alive generally, but remove the specific listener
            };
        }
    }, [currentUserId, fetchNotifications, dispatch, navigate]);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        refresh: fetchNotifications
    };
};
