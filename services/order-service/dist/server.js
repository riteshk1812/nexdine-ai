import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { logger } from "./utils/logger.js";
const bootstrap = async () => {
    await connectDatabase();
    const server = app.listen(env.PORT, () => {
        logger.info("Order Service Started", {
            port: env.PORT,
            environment: env.NODE_ENV,
        });
    });
    let shuttingDown = false;
    const shutdown = (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        logger.info(`${signal} received. Shutting down`);
        server.close(() => {
            void disconnectDatabase()
                .then(() => {
                logger.info("Order Service stopped");
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
bootstrap().catch((error) => {
    logger.error("Order Service startup failed", { error });
    process.exitCode = 1;
});
//# sourceMappingURL=server.js.map