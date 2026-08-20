import express from "express"
import { categoriesController } from "./categories.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "../../../generated/prisma/enums"
import { validateRequest } from "../../middleware/validateRequest"
import { categoryZodSchema } from "./categories.validation"


const router=express.Router()

router.post("/",validateRequest(categoryZodSchema),checkAuth(Role.ADMIN), categoriesController.createCategories)
router.get("/",categoriesController.getAllCategory)
router.patch("/:id",validateRequest(categoryZodSchema),checkAuth(Role.ADMIN), categoriesController.updateCategory)
router.delete("/:id",checkAuth(Role.ADMIN), categoriesController.deleteCategory)

export const categoriesRoutes=router