import { z } from "zod";

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
