import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: env.NODE_ENV !== "production",
    });

    logger.info("Restaurant MongoDB connected", {
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error) {
    logger.error("Restaurant MongoDB connection failed", {
      error,
    });

    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("Restaurant MongoDB disconnected");
};
