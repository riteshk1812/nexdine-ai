import app from "./app.js";

import { env } from "./config/env.js";

import { connectDatabase, disconnectDatabase } from "./config/database.js";

import { logger } from "./utils/logger.js";

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info("Product Service started", {
      port: env.PORT,
      environment: env.NODE_ENV,
    });
  });

  let shuttingDown = false;

  const shutdown = (signal: string): void => {
    if (shuttingDown) return;

    shuttingDown = true;

    logger.info(`${signal} received. Starting shutdown`);

    server.close(() => {
      void disconnectDatabase()
        .then(() => {
          logger.info("Product Service stopped");
        })
        .catch((error) => {
          logger.error("Database shutdown failed", { error });
          process.exitCode = 1;
        });
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

bootstrap().catch((error: unknown) => {
  logger.error("Product Service startup failed", { error });
  process.exitCode = 1;
});
