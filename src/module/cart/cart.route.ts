import express from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";

import { createCartZodSchema, updateCartZodSchema } from "./cart.validation";
import { cartController } from "./cart.controller";

const router = express.Router();

router.post(
  "/items",
  checkAuth(Role.CUSTOMER),
  validateRequest(createCartZodSchema),
  cartController.addToCart,
);

router.get("/", checkAuth(Role.CUSTOMER), cartController.getCart);
router.patch(
  "/items/:productId",
  checkAuth(Role.CUSTOMER),
  validateRequest(updateCartZodSchema),
  cartController.updateCartItem,
);

router.delete(
  "/items/:productId",
  checkAuth(Role.CUSTOMER),
  cartController.deleteCartItem,
);

export const cartRoutes = router;
