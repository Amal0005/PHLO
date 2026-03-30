import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationEntity } from "@/interface/notification/notificationInterface";

interface NotificationState {
    notifications: NotificationEntity[];
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationEntity[]>) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action: PayloadAction<NotificationEntity>) => {
            // Add to start of list
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
        markRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find((n) => n.id === action.payload);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => {
                n.isRead = true;
            });
            state.unreadCount = 0;
        },
        markChatRead: (state, action: PayloadAction<string>) => {
            state.notifications.forEach(n => {
                if (n.type === "CHAT" && n.metadata?.conversationId === action.payload && !n.isRead) {
                    n.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    setUnreadCount,
    markRead,
    markAllAsRead,
    markChatRead,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
