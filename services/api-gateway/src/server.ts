import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info(`API Gateway running on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} recieved. Shuting down....`);
  server.close((error) => {
    if (error) {
      logger.error("Error during shutdown", {
        error,
      });
      process.exitCode = 1;
      return;
    }

    logger.info("HTTP Server closed successfully");
    process.exitCode = 0;
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
