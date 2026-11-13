import type { QueryFilter } from "mongoose";

import { ProductModel, type Product } from "../models/product.model.js";

import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "../validators/product.validator.js";

interface ProductFilters extends ListProductsQuery {}

export const productRepository = {
  create: async (data: CreateProductInput & { slug: string }) => {
    return ProductModel.create(data);
  },

  findById: async (id: string) => {
    return ProductModel.findById(id).exec();
  },

  findMany: async (filters: ProductFilters) => {
    const query: QueryFilter<Product> = {};
    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.q) {
      query.$text = {
        $search: filters.q,
      };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.priceMinor = {
        ...(filters.minPrice !== undefined && { $gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
      };
    }
    const skip = (filters.page - 1) * filters.limit;
    const sort = {
      [filters.sortBy]: filters.sortOrder === "asc" ? 1 : -1,
    } as const;

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filters.limit)
        .exec(),
      ProductModel.countDocuments(query).exec(),
    ]);

    return {
      products,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  },

  updateById: async (
    id: string,
    data: UpdateProductInput & { slug?: string },
  ) => {
    return ProductModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  },

  deleteById: async (id: string) => {
    return ProductModel.findByIdAndDelete(id).exec();
  },
};
