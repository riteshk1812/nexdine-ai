import { Router } from "express";
import { healthCheck } from "../controllers/health.controller.js";

const app: Router = Router();

app.get("/health", healthCheck);

export default app;
