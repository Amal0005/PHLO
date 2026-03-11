import { Router } from "express";
import { notificationController } from "../../framework/depInjection/notificationInjections";
import { authMiddleware } from "@/framework/depInjection/user/userInjections";

const notificationRouter = Router();

notificationRouter.get("/", authMiddleware, (req, res) => notificationController.getNotification(req, res));
notificationRouter.get("/unread-count", authMiddleware, (req, res) => notificationController.countUnreadDocument(req, res));
notificationRouter.get("/:notificationId", authMiddleware, (req, res) => notificationController.getNotificationDetails(req, res));
notificationRouter.patch("/mark-read/:notificationId", authMiddleware, (req, res) => notificationController.markAsRead(req, res));
notificationRouter.patch("/mark-all-read", authMiddleware, (req, res) => notificationController.markAllAsRead(req, res));

export default notificationRouter;
