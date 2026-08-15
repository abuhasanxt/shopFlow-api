import express from "express"
import { categoriesController } from "./categories.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "../../../generated/prisma/enums"


const router=express.Router()

router.post("/",checkAuth(Role.CUSTOMER), categoriesController.createCategories)
router.get("/",categoriesController.getAllCategory)
router.patch("/:id",categoriesController.updateCategory)
router.delete("/:id",categoriesController.deleteCategory)

export const categoriesRoutes=router