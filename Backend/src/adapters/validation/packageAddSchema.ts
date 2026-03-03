import { z } from "zod";

export const addPackageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).optional(),
  locations: z.array(
    z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
      placeName: z.string().min(1, "Location name is required"),
    })
  ).min(1, "At least one location is required"),
});
