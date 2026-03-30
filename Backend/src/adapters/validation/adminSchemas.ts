import { z } from "zod";

export const adminLoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const categorySchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be under 50 characters"),
    description: z
        .string()
        .trim()
        .max(200, "Description must be under 200 characters")
        .optional()
        .transform(val => val || "")
});

export const subscriptionSchema = z.object({
    planName: z.string().min(3).max(50),
    price: z.number().min(0),
    durationInMonths: z.number().min(1).max(24),
    features: z.array(z.string()).min(1),
    isListed: z.boolean().optional().default(true),
});

export const walletCreditSchema = z.object({
    creatorId: z.string().min(1, "Creator ID is required"),
    amount: z.number().min(1, "Amount must be at least 1"),
    description: z.string().optional(),
});
