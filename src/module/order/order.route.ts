import express from "express";
import { orderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/checkout",checkAuth(Role.CUSTOMER), orderController.createOrder);

export const orderRoutes = router;
