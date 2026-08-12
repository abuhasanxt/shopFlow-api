import express from "express";
import { customerController } from "./customer.controller";

const router = express.Router();
router.get("/",customerController.getAllCustomer);
router.get("/me",customerController.getMe);
router.get("/:id",customerController.getById);

export const customerRoutes = router;
