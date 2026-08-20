import express from "express";
import { customerController } from "./customer.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { customerZodSchema } from "./customer.validation";

const router = express.Router();
router.get("/", checkAuth(Role.ADMIN), customerController.getAllCustomer);
router.get("/me",checkAuth(), customerController.getMe);
router.get("/:id",checkAuth(Role.ADMIN), customerController.getById);
router.patch("/me",checkAuth(),multerUpload.single("imageUrl"),validateRequest(customerZodSchema), customerController.updateMe);
router.delete("/me",checkAuth(), customerController.deleteMe);

export const customerRoutes = router;
