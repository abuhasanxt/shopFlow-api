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

router.post("/verify-email",authController.emailVerify)




router.get("/login/google",authController.googleLogin)
router.get("/google/success",authController.googleLoginSuccess)
router.get("/oauth/error",authController.handleOAuthError)
export const authRoutes = router;
