import { z } from "zod";

const addressSchema = z
  .object({
    line1: z.string().trim().min(3).max(200),

    city: z.string().trim().min(2).max(80),

    state: z.string().trim().min(2).max(80),

    postalCode: z.string().trim().min(4).max(12),

    country: z.string().trim().default("India"),
  })
  .strict();

const coordinatesSchema = z
  .object({
    longitude: z.number().min(-180).max(180),

    latitude: z.number().min(-90).max(90),
  })
  .strict();

const openingHoursSchema = z
  .object({
    day: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ]),

    openTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),

    closeTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),

    isClosed: z.boolean().default(false),
  })
  .strict()
  .refine(
    (value) => value.isClosed || Boolean(value.openTime && value.closeTime),
    {
      message:
        "Open and close times are required unless the restaurant is closed",
    },
  );

export const createRestaurantSchema = z
  .object({
    name: z.string().trim().min(2).max(120),

    description: z.string().trim().min(5).max(2000),

    contactEmail: z.string().email(),

    phone: z.string().regex(/^\+?[0-9 -]{7,20}$/),

    cuisines: z.array(z.string().trim().min(2)).min(1),

    address: addressSchema,

    coordinates: coordinatesSchema,

    openingHours: z.array(openingHoursSchema).default([]),

    deliveryRadiusMeters: z.number().int().min(0).max(100000).default(5000),

    deliveryFeeMinor: z.number().int().min(0).default(0),

    minimumOrderMinor: z.number().int().min(0).default(0),

    isAcceptingOrders: z.boolean().default(true),
  })
  .strict();

export const updateRestaurantSchema = createRestaurantSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be supplied",
  );

export const listRestaurantsQuerySchema = z.object({
  city: z.string().trim().optional(),

  cuisine: z.string().trim().optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),

  isAcceptingOrders: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const nearbyRestaurantsQuerySchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),

  latitude: z.coerce.number().min(-90).max(90),

  maxDistanceMeters: z.coerce.number().int().min(100).max(50000).default(5000),

  cuisine: z.string().trim().optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

export type ListRestaurantsQuery = z.infer<typeof listRestaurantsQuerySchema>;

export type NearbyRestaurantsQuery = z.infer<
  typeof nearbyRestaurantsQuerySchema
>;
