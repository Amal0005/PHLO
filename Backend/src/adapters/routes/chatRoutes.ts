import { Router } from "express";
import { chatController } from "../../framework/depInjection/chatInjections";
import { authMiddleware } from "@/framework/depInjection/user/userInjections";

const chatRouter = Router();

chatRouter.get("/conversations", authMiddleware, (req, res) => chatController.getConversation(req,res));
chatRouter.get("/messages/:conversationId", authMiddleware, (req, res) => chatController.getMessage(req,res));
chatRouter.post("/message", authMiddleware, (req, res) => chatController.sendMessage(req,res));
chatRouter.get("/ensure-conversation/:bookingId", authMiddleware, (req, res) => chatController.createConversation(req,res));

export default chatRouter;
