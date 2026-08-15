import z from "zod";

export const createCartZodSchema = z.object({
  productId: z
    .string("product ID is required")
    .uuid("product ID must be a valid UUID"),
quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),

});