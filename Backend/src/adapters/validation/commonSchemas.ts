import { z } from "zod";

export const sendMessageSchema = z.object({
    receiverId: z.string().min(1, "Receiver ID is required"),
    content: z.string().min(1, "Message content cannot be empty"),
    conversationId: z.string().optional(),
});

export const presignUrlSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    fileType: z.string().startsWith("image/", "Only images are allowed"),
    folder: z.string().optional().default("uploads"),
});
