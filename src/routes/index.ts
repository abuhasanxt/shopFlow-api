import express from "express"
import { categoriesRoutes } from "../module/categories/categories.route"



const router=express.Router()

router.use("/categories",categoriesRoutes)


export const IndexRoute=router