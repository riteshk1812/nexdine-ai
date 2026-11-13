import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { validateBody } from "../middleware/validate.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

const router: Router = Router();

router
  .route("/products")
  .post(validateBody(createProductSchema), createProduct)
  .get(getProducts);

router
  .route("/products/:id")
  .get(getProductById)
  .patch(validateBody(updateProductSchema), updateProduct)
  .delete(deleteProduct);

export default router;
