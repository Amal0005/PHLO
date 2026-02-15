import { z } from "zod";

export const packageSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).optional(),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }),
  placeName: z.string().min(1, "Location name is required"),
});

export const editPackageSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  category: z.string().min(1, "Please select a category").optional(),
  images: z.array(z.string()).optional(),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }).optional(),
  placeName: z.string().optional(),
}).refine(
  (data) => Object.keys(data).some(key => data[key as keyof typeof data] !== undefined),
  { message: "At least one field must be provided for update" }
);

export type PackageFormData = z.infer<typeof packageSchema>;
export type EditPackageFormData = z.infer<typeof editPackageSchema>;