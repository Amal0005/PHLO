import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    addNotification,
    setNotifications,
    appendNotifications,
    setUnreadCount,
    markRead,
    markAllAsRead,
    markChatRead
} from "@/store/slices/notification/notificationSlice";
import api from "@/axios/axiosConfig";
import { socketService } from "@/services/socketService";
import { NotificationEntity, NotificationType } from "@/interface/notification/notificationInterface";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useNotifications = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
    const user = useSelector((state: RootState) => state.user.user);
    const creator = useSelector((state: RootState) => state.creator.creator);
    const admin = useSelector((state: RootState) => state.admin.admin);
    const navigate = useNavigate();
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const isCreatorRoute = window.location.pathname.startsWith('/creator');

    let currentUserId: string | undefined;
    if (isAdminRoute) {
        currentUserId = admin?.id || (admin as unknown as { _id: string })?._id;
    } else if (isCreatorRoute) {
        currentUserId = creator?.id || (creator as unknown as { _id: string })?._id;
    } else {
        currentUserId = user?.id || (user as unknown as { _id: string })?._id;
    }

    const fetchNotifications = useCallback(async () => {
        if (!currentUserId) return;
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get("/notifications?page=1&limit=15"),
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

    const fetchMore = useCallback(async (page: number) => {
        if (!currentUserId) return;
        try {
            const res = await api.get(`/notifications?page=${page}&limit=15`);
            if (res.data.success) {
                if (res.data.notifications.length > 0) {
                    dispatch(appendNotifications(res.data.notifications));
                    return true;
                }
                return false;
            }
        } catch (error) {
            console.error("Error fetching more notifications:", error);
        }
        return false;
    }, [currentUserId, dispatch]);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            const res = await api.patch(`/notifications/mark-read/${notificationId}`);
            if (res.data.success) {
                dispatch(markRead(notificationId));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    }, [dispatch]);

    const markAllNotificationsAsRead = useCallback(async () => {
        try {
            const res = await api.patch("/notifications/mark-all-read");
            if (res.data.success) {
                dispatch(markAllAsRead());
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    }, [dispatch]);

    const markChatAsRead = useCallback(async (conversationId: string) => {
        try {
            const res = await api.patch(`/notifications/mark-chat-read/${conversationId}`);
            if (res.data.success) {
                dispatch(markChatRead(conversationId));
            }
        } catch (error) {
            console.error("Error marking chat notifications as read:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!currentUserId) return;

        fetchNotifications();

        socketService.connect(currentUserId);
        const socket = socketService.getSocket();

        const handleNotification = (notification: NotificationEntity) => {
            dispatch(addNotification(notification));

            // Suppress toast if in chat page and is chat notification
            const isChatPage = window.location.pathname.includes('/chat');
            if (isChatPage && notification.type === NotificationType.CHAT) {
                return;
            }

            // Show toast
            toast.info(`${notification.title}: ${notification.message}`, {
                position: "top-center",
                autoClose: 2000,
                className: "bg-black/80 backdrop-blur-3xl text-white rounded-[2rem] border border-white/10 shadow-2xl cursor-pointer",
                onClick: () => {
                    const isCreator = window.location.pathname.startsWith('/creator');

                    if (notification.type === NotificationType.CHAT) {
                        const conversationId = notification.metadata?.conversationId;
                        const bookingId = notification.metadata?.bookingId;
                        let chatPath = isCreator ? '/creator/chat' : '/chat';
                        if (conversationId) chatPath += `?conversationId=${conversationId}`;
                        else if (bookingId) chatPath += `?bookingId=${bookingId}`;
                        navigate(chatPath);
                    } else if (notification.type === NotificationType.BOOKING) {
                        navigate(isCreator ? '/creator/bookings' : '/bookings');
                    }
                    // Mark as read when clicking the toast too
                    markAsRead(notification.id);
                }
            });
        };

        if (socket) {
            socket.on("notification", handleNotification);

            return () => {
                socket.off("notification", handleNotification);
            };
        }
    }, [currentUserId, fetchNotifications, dispatch, navigate, markAsRead]);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        markChatAsRead,
        refresh: fetchNotifications,
        fetchMore
    };
};
