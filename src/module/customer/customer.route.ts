import express from "express";
import { customerController } from "./customer.controller";

const router = express.Router();
router.get("/",customerController.getAllCustomer);

export const customerRoutes = router;
