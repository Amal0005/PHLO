import { Router } from "express";
import { chatController } from "../../framework/depInjection/chatInjections";
import { authMiddleware } from "@/framework/depInjection/user/userInjections";

const chatRouter = Router();

chatRouter.get("/conversations", authMiddleware, (req, res) => chatController.GetConversation(req,res));
chatRouter.get("/messages/:conversationId", authMiddleware, (req, res) => chatController.GetMessage(req,res));
chatRouter.post("/message", authMiddleware, (req, res) => chatController.SendMessage(req,res));
chatRouter.get("/ensure-conversation/:bookingId", authMiddleware, (req, res) => chatController.GetOrCreateConversation(req,res));

export default chatRouter;
