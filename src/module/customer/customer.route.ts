import express from "express";
import { customerController } from "./customer.controller";

const router = express.Router();
router.get("/",customerController.getAllCustomer);
router.get("/me",customerController.getMe);
router.get("/:id",customerController.getById);
router.patch("/:id",customerController.updateMe);

export const customerRoutes = router;
