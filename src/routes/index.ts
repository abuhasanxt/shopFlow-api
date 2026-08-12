import express from "express"
import { categoriesRoutes } from "../module/categories/categories.route"
import { userRoutes } from "../module/auth/auth.route"



const router=express.Router()

router.use("/categories",categoriesRoutes)
router.use("/auth/register",userRoutes)


export const IndexRoute=router