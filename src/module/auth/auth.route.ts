import express from "express"
import { userController } from "./auth.controller"

const router=express.Router()

router.post("/",userController.registerCustomer)


export const userRoutes=router