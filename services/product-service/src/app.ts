import express from "express";
import helmet from "helmet";

import productRoutes from "./routes/product.routes.js";

import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app: express.Express = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "product-service",
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", productRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
