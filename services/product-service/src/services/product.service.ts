import { isValidObjectId } from "mongoose";

import { productRepository } from "../repositories/product.repository.js";
import { AppError } from "../utils/app-error.js";

import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "../validators/product.validator.js";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^-|-$/g, "");
};

const validateProductId = (id: string): void => {
  if (!isValidObjectId(id)) {
    throw new AppError(400, "Invalid Product ID");
  }
};

export const productService = {
  createProduct: async (input: CreateProductInput) => {
    const slug = generateSlug(input.name);

    return productRepository.create({
      ...input,
      sku: input.sku.toUpperCase(),
      slug,
    });
  },

  getProducts: async (filters: ListProductsQuery) => {
    return productRepository.findMany(filters);
  },

  getProductById: async (id: string) => {
    validateProductId(id);

    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError(404, "Product not found!!");
    }

    return product;
  },

  updateProduct: async (id: string, input: UpdateProductInput) => {
    validateProductId(id);

    const data: UpdateProductInput & { slug?: string } = {
      ...input,
    };

    if (input.name) {
      data.slug = generateSlug(input.name);
    }

    if (input.sku) {
      data.sku = input.sku.toUpperCase();
    }

    const product = await productRepository.updateById(id, data);

    if (!product) {
      throw new AppError(404, "Product not found!!");
    }
    return product;
  },

  deleteProduct: async (id: string) => {
    validateProductId(id);
    const product = await productRepository.deleteById(id);

    if (!product) {
      throw new AppError(404, "Product not found!!");
    }

    return product;
  },
};
