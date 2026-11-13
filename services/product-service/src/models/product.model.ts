import { Schema, model, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 120,
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
      trim: true,
      maxlength: 2000,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    priceMinor: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Price must be an integer",
      },
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Stock must be a non-negative integer",
      },
    },
    tags: [{ type: String, trim: true }],
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "DRAFT", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

productSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
});

productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

export type Product = InferSchemaType<typeof productSchema>;

export const ProductModel = model<Product>("Product", productSchema);
