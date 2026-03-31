import { z } from "zod";

export const sendMessageSchema = z.object({
    receiverId: z.string().min(1, "Receiver ID is required"),
    message: z.string().min(1, "Message content cannot be empty"),
    conversationId: z.string().optional(),
    type: z.enum(["text", "image"]).default("text"),
});

export const presignUrlSchema = z.object({
    fileType: z.string().startsWith("image/", "Only images are allowed"),
    folder: z.string().min(1, "Folder is required"),
});
