import express from "express";
import helmet from "helmet";
import { prisma } from "./config/prisma.js";
const app = express();
app.use(helmet());
app.use(express.json({
    limit: "1mb",
}));
// Database readiness endpoint
app.get("/health", async (_req, res) => {
    await prisma.$queryRaw `SELECT 1`;
    res.status(200).json({
        success: true,
        service: "order-service",
        status: "UP",
        database: "CONNECTED",
        timeStamp: new Date().toISOString(),
    });
});
export default app;
//# sourceMappingURL=app.js.map