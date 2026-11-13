import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";

import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app: express.Express = express();

// Security Headers
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// Request Parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(env.API_PREFIX, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
