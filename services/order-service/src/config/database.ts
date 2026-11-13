import { prisma } from "./prisma.js";
import { logger } from "../utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();

  // Verify that PostgresSQL is responding
  await prisma.$queryRaw`SELECT 1`;
  logger.info("PostgresSQL Connected Successfully!!");
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info("PostgresSQL Disconnected!!");
};
