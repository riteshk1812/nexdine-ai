import { Schema, model, type InferSchemaType } from "mongoose";

const addressSchema = new Schema(
  {
    line1: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },
  },
  { _id: false },
);

const locationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number[]) =>
          value.length === 2 &&
          value[0] >= -180 &&
          value[0] <= 180 &&
          value[1] >= -90 &&
          value[1] <= 90,
        message: "Invalid geographical coordinates",
      },
    },
  },
  { _id: false },
);

const openingHoursSchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ],
      required: true,
    },
    openTime: {
      type: String,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    closeTime: {
      type: String,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    cuisines: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    address: {
      type: addressSchema,
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    openingHours: {
      type: [openingHoursSchema],
      default: [],
    },
    deliveryRadiusMeters: {
      type: Number,
      default: 5000,
      min: 0,
    },
    deliveryFeeMinor: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrderMinor: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    isAcceptingOrders: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

restaurantSchema.index({
  location: "2dsphere",
});

restaurantSchema.index({
  "address.city": 1,
  status: 1,
});

restaurantSchema.index({
  cuisines: 1,
  status: 1,
});

restaurantSchema.index({
  status: 1,
  isAcceptingOrders: 1,
});

export type Restaurant = InferSchemaType<typeof restaurantSchema>;

export const RestaurantModel = model<Restaurant>(
  "Restaurant",
  restaurantSchema,
);
