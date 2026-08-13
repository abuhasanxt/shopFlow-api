import express from "express"
import { categoriesRoutes } from "../module/categories/categories.route"
import { userRoutes } from "../module/auth/auth.route"
import { customerRoutes } from "../module/customer/customer.route"
import { productRoutes } from "../module/products/product.route"



const router=express.Router()

router.use("/categories",categoriesRoutes)
router.use("/auth",userRoutes)
router.use("/customers",customerRoutes)
router.use("/products",productRoutes)


export const IndexRoute=router