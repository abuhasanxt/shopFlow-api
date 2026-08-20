import z from "zod";

export const customerZodSchema = z.object({
  name: z
    .string("Name is required and must be string")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be at most 30 characters"),
});