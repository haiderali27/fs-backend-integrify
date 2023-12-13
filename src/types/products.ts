import { z } from "zod";

export const productSchema = z.object({
  title: z.string({
    required_error: "Name is required",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  price: z.number({
    required_error: "Price is required",
  }),
  images: z.array(z.string({
    required_error: "Image URL is required",
  })),
  categoryId: z.string(), // Assuming categoryId is a string, you can adjust it accordingly
});

export type Product = z.infer<typeof productSchema> & { _id: string; categoryId: string };
