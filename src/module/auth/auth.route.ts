import express from "express"
import { userController } from "./auth.controller"

const router=express.Router()

router.post("/register",userController.registerCustomer)
router.post("/login",userController.loginUser)


export const userRoutes=router