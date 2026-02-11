import { z } from "zod";

export const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).optional(),
});

export type PackageFormData = z.infer<typeof packageSchema>;
