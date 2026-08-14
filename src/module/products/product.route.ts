import express from "express";
import { productController } from "./product.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createProductZodSchema, updateProductZodSchema } from "./product.Validation";
const router = express.Router();


router.post("/",validateRequest(createProductZodSchema), productController.createProduct);
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.patch("/:id",validateRequest(updateProductZodSchema), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export const productRoutes = router;
