import { IGetConversationUseCase } from "@/domain/interface/chat/IGetConversationUseCase";
import { IGetMessagesUseCase } from "@/domain/interface/chat/IGetMessageUseCase";
import { ISendMessageUseCase } from "@/domain/interface/chat/ISendMessageUseCase";
import { CreateConversationUseCase } from "@/application/useCases/chat/createConversationUseCase";
import { Response } from "express";
import { AuthRequest } from "../middlewares/jwtAuthMiddleware";
import { StatusCode } from "@/constants/statusCodes";

export class ChatController {
    constructor(
        private _getConversationUseCase: IGetConversationUseCase,
        private _getMessageUseCase: IGetMessagesUseCase,
        private _sendMessageUseCase: ISendMessageUseCase,
        private _getOrCreateConversationUseCase: CreateConversationUseCase
    ) { }
    async GetConversation(req: AuthRequest, res: Response) {
        const userId = req.user?.userId as string;
        const conversation = await this._getConversationUseCase.getConversation(userId);
        return res.status(StatusCode.OK).json({ success: true, conversation })

    }
    async GetMessage(req: AuthRequest, res: Response) {
        const conversationId = req.params.conversationId as string;
        const message = await this._getMessageUseCase.getMessage(conversationId);
        return res.status(StatusCode.OK).json({ success: true, message })
    }
    async SendMessage(req: AuthRequest, res: Response) {
        const { conversationId, message, receiverId } = req.body;
        const senderId = req.user?.userId as string;
        const result = await this._sendMessageUseCase.sendMessage({ conversationId, senderId, message, recipientId: receiverId });
        return res.status(StatusCode.OK).json({ success: true, message: result })
    }

    async GetOrCreateConversation(req: AuthRequest, res: Response) {
        const bookingId = req.params.bookingId;
        const conversation = await this._getOrCreateConversationUseCase.execute(bookingId);
        return res.status(StatusCode.OK).json({ success: true, conversation });
    }
}