import express from "express";
import { orderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/checkout",checkAuth(Role.CUSTOMER), orderController.createOrder);
router.get("/",checkAuth(Role.CUSTOMER,Role.ADMIN), orderController.getAllOrder);

router.get("/:id",checkAuth(Role.CUSTOMER,Role.ADMIN), orderController.getOrderById);
export const orderRoutes = router;
