import { z } from "zod";

export const editPackageSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  category: z.string().min(1, "Category is required").optional(),
  images: z.array(z.string()).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);
