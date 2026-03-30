import { Router } from "express";
import { chatController } from "@/framework/depInjection/chatInjections";
import { authMiddleware } from "@/framework/depInjection/user/userInjections";
import { BACKEND_ROUTES } from "@/constants/backendRoutes";
import { validate } from "@/adapters/middlewares/zodValidator";
import { sendMessageSchema } from "@/adapters/validation/commonSchemas";

const chatRouter = Router();

chatRouter.get(BACKEND_ROUTES.CHAT.CONVERSATIONS, authMiddleware, (req, res) => chatController.getConversation(req, res));
chatRouter.get(BACKEND_ROUTES.CHAT.MESSAGES, authMiddleware, (req, res) => chatController.getMessage(req, res));
chatRouter.post(BACKEND_ROUTES.CHAT.SEND_MESSAGE, authMiddleware, validate(sendMessageSchema), (req, res) => chatController.sendMessage(req, res));
chatRouter.get(BACKEND_ROUTES.CHAT.ENSURE_CONVERSATION, authMiddleware, (req, res) => chatController.createConversation(req, res));
chatRouter.patch(BACKEND_ROUTES.CHAT.MARK_SEEN, authMiddleware, (req, res) => chatController.markSeen(req, res));

export default chatRouter;
