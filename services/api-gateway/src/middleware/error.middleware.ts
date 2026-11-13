import type { Request, Response, NextFunction } from "express";

import { logger } from "../utils/logger.js";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = error.statusCode ?? 500;

  logger.error(error.message, {
    stack: error.stack,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : error.message,
  });
};
