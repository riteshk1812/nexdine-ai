import type { ErrorRequestHandler } from "express";

import mongoose from "mongoose";

import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  logger.error("Product Service request failed", {
    error,
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    res.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  }

  const mongoError = error as {
    code?: number;
    keyValue?: Record<string, unknown>;
  };

  if (mongoError.code === 11000) {
    res.status(409).json({
      success: false,
      message: "Product SKU or slug already exists",
      fields: mongoError.keyValue,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
