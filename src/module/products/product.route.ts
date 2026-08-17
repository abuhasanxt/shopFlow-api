import express from "express";
import { productController } from "./product.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.Validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
const router = express.Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  multerUpload.single("imageUrl"),
  validateRequest(createProductZodSchema),
  productController.createProduct,
);
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.patch(
  "/:id",
  multerUpload.single("imageUrl"),
  checkAuth(Role.ADMIN),
  validateRequest(updateProductZodSchema),
  productController.updateProduct,
);
router.delete("/:id", checkAuth(Role.ADMIN), productController.deleteProduct);

export const productRoutes = router;
