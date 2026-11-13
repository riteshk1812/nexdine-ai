import { z } from "zod";

export const createProductSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(5).max(2000),
    sku: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9][A-Z0-9_-]{2,39}$/),
    priceMinor: z.number().int().nonnegative(),
    currency: z.enum(["INR", "USD"]).default("INR"),
    category: z.string().trim().min(2).max(80),
    stock: z.number().int().nonnegative().default(0),
    tags: z.array(z.string().trim()).default([]),
    images: z.array(z.string().url()).default([]),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
  })
  .strict();

export const updateProductSchema = createProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be supplied",
  );

export const listProductsQuerySchema = z
  .object({
    q: z.string().trim().optional(),
    category: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(["createdAt", "priceMinor", "name"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    minPrice: z.coerce.number().int().nonnegative().optional(),
    maxPrice: z.coerce.number().int().nonnegative().optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice cannot exceed maxPrice",
    },
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
