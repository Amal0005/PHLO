import { Router } from "express";
import { notificationController } from "../../framework/depInjection/notificationInjections";
import { authMiddleware } from "@/framework/depInjection/user/userInjections";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";
const notificationRouter = Router();

notificationRouter.get(BACKEND_ROUTES.NOTIFICATION.GET_ALL, authMiddleware, (req, res) => notificationController.getNotification(req, res));
notificationRouter.get(BACKEND_ROUTES.NOTIFICATION.UNREAD_COUNT, authMiddleware, (req, res) => notificationController.countUnreadDocument(req, res));
notificationRouter.get(BACKEND_ROUTES.NOTIFICATION.DETAIL, authMiddleware, (req, res) => notificationController.getNotificationDetails(req, res));
notificationRouter.patch(BACKEND_ROUTES.NOTIFICATION.MARK_READ, authMiddleware, (req, res) => notificationController.markAsRead(req, res));
notificationRouter.patch(BACKEND_ROUTES.NOTIFICATION.MARK_ALL_READ, authMiddleware, (req, res) => notificationController.markAllAsRead(req, res));
notificationRouter.patch(BACKEND_ROUTES.NOTIFICATION.MARK_CHAT_READ, authMiddleware, (req, res) => notificationController.markChatAsRead(req, res));

export default notificationRouter;
