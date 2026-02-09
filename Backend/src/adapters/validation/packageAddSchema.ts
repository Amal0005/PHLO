import { z } from "zod";

export const addPackageSchema = z.object({
    creatorId:z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).optional(),
});
