import express from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { emailVerifyZodSchema, userLoginZodSchema, userRegisterZodSchema } from "./auth.validation";

const router = express.Router();

router.post("/register",validateRequest(userRegisterZodSchema), authController.registerCustomer);
router.post("/login",validateRequest(userLoginZodSchema) ,authController.loginUser);

router.post("/refresh", authController.getNewToken);
router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.CUSTOMER),
  authController.logoutUser,
);

router.post("/verify-email",validateRequest(emailVerifyZodSchema),authController.emailVerify)




router.get("/login/google",authController.googleLogin)
router.get("/google/success",authController.googleLoginSuccess)
router.get("/oauth/error",authController.handleOAuthError)
export const authRoutes = router;
