import express from "express"
import { categoriesRoutes } from "../module/categories/categories.route"

import { customerRoutes } from "../module/customer/customer.route"
import { productRoutes } from "../module/products/product.route"
import { authRoutes } from "../module/auth/auth.route"
import { cartRoutes } from "../module/cart/cart.route"
import { orderRoutes } from "../module/order/order.route"



const router=express.Router()

router.use("/categories",categoriesRoutes)
router.use("/auth",authRoutes)
router.use("/customers",customerRoutes)
router.use("/products",productRoutes)
router.use("/cart",cartRoutes)
router.use("/orders",orderRoutes)


export const IndexRoute=router