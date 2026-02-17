import { z } from "zod";

export const subscriptionSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Plan name must be at least 3 characters long")
        .max(50, "Plan name must not exceed 50 characters"),
    type: z.enum(["User", "Creator"]),
    price: z.number()
        .min(1, "Price must be 1 or more (negative prices not allowed)"),
    duration: z.number()
        .int("Please enter a full number of months")
        .min(1, "Plan duration must be at least 1 month"),
    features: z.array(
        z.string().trim().min(2, "Feature description needs to be more descriptive")
    ).min(1, "Please provide at least one feature for this plan"),
    isActive: z.boolean().default(true),
});
