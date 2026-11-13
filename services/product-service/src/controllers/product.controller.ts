import type { Request, Response } from "express";
import { productService } from "../services/product.service.js";

import { listProductsQuerySchema } from "../validators/product.validator.js";

type ProductIdParams = {
  id: string;
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully!!",
    data: product,
  });
};

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = listProductsQuerySchema.safeParse(req.query);

  if (!query.success) {
    res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: query.error.issues,
    });
    return;
  }

  const result = await productService.getProducts(query.data);
  res.status(200).json({
    success: true,
    data: result.products,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
};

export const getProductById = async (
  req: Request<ProductIdParams>,
  res: Response,
): Promise<void> => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProduct = async (
  req: Request<ProductIdParams>,
  res: Response,
): Promise<void> => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

export const deleteProduct = async (
  req: Request<ProductIdParams>,
  res: Response,
): Promise<void> => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
