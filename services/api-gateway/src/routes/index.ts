// Define API Endpoints
import { Router } from "express";
import healtRoutes from "./health.routes.js";

const router: Router = Router();

router.use(healtRoutes);

export default router;
