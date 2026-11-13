import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: env.NODE_ENV !== "production",
    });

    logger.info("MongoDB Connected Successfully!!", {
      database: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error) {
    logger.error("MongoDB connection failed", { error });
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info("MongoDB Disconnected!!");
};
