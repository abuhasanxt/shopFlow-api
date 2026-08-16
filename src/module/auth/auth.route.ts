import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/register", authController.registerCustomer);
router.post("/login", authController.loginUser);

router.post("/refresh", authController.getNewToken);

export const authRoutes = router;
