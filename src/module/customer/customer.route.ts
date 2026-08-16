import express from "express";
import { customerController } from "./customer.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();
router.get("/", checkAuth(Role.ADMIN), customerController.getAllCustomer);
router.get("/me",checkAuth(), customerController.getMe);
router.get("/:id",checkAuth(Role.ADMIN), customerController.getById);
router.patch("/me",checkAuth(), customerController.updateMe);
router.delete("/me",checkAuth(), customerController.deleteMe);

export const customerRoutes = router;
