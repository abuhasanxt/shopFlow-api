import express from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/register", authController.registerCustomer);
router.post("/login", authController.loginUser);

router.post("/refresh", authController.getNewToken);
router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.CUSTOMER),
  authController.logoutUser,
);

export const authRoutes = router;
