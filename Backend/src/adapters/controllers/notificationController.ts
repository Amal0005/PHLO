import type { ICountUnreadUseCase } from "@/domain/interface/notification/ICountUnreadUseCase";
import type { IGetNotificationDetailsUseCase } from "@/domain/interface/notification/IGetNotificationDetailUseCase";
import type { IGetNotificationsUseCase } from "@/domain/interface/notification/IGetNotificationsUseCase";
import type { IMarkNotificationReadUseCase } from "@/domain/interface/notification/IMarkNotificationReadUseCase";
import type { AuthRequest } from "@/adapters/middlewares/jwtAuthMiddleware";
import type { Response } from "express";
import { StatusCode } from "@/constants/statusCodes";
import type { IMarkAllNotificationReadUseCase } from "@/domain/interface/notification/IMarkAllNotificationReadUseCase";
import type { IMarkChatNotificationReadUseCase } from "@/domain/interface/notification/IMarkChatNotificationReadUseCase";

export class NotificationController {
    constructor(
        private _getNotificationUseCase: IGetNotificationsUseCase,
        private _getNotificationDetailUSeCase: IGetNotificationDetailsUseCase,
        private _countUnreadUseCase: ICountUnreadUseCase,
        private _markNotificationReadUseCase: IMarkNotificationReadUseCase,
        private _markAllReadUseCase: IMarkAllNotificationReadUseCase,
        private _markChatReadUseCase: IMarkChatNotificationReadUseCase
    ) {}
    async getNotification(req: AuthRequest, res: Response) {
        const userId = req.user?.userId as string
        const { page, limit } = req.query;
        const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
        const notifications = await this._getNotificationUseCase.getNotification(
            userId,
            skip,
            limit ? Number(limit) : undefined
        )
        return res.status(StatusCode.OK).json({ success: true, notifications });
    }
    async getNotificationDetails(req: AuthRequest, res: Response) {
        const { notificationId } = req.params
        const notification = await this._getNotificationDetailUSeCase.getDetails(notificationId)
        return res.status(StatusCode.OK).json({ success: true, notification });
    }
    async markAsRead(req: AuthRequest, res: Response) {
        const { notificationId } = req.params
        await this._markNotificationReadUseCase.markNotificationRead(notificationId)
        return res.status(StatusCode.OK).json({ success: true });
    }
    async markAllAsRead(req: AuthRequest, res: Response) {
        const userId = req.user?.userId as string
        await this._markAllReadUseCase.markAllRead(userId)
        return res.status(StatusCode.OK).json({ success: true });
    }
    async markChatAsRead(req: AuthRequest, res: Response) {
        const userId = req.user?.userId as string
        const { conversationId } = req.params
        await this._markChatReadUseCase.markChatRead(userId, conversationId)
        return res.status(StatusCode.OK).json({ success: true });
    }
    async countUnreadDocument(req: AuthRequest, res: Response) {
        const userId = req.user?.userId as string
        const count = await this._countUnreadUseCase.countUnread(userId)
        return res.status(StatusCode.OK).json({ success: true, count });
    }

}