import express from "express"
import { categoriesController } from "./categories.controller"


const router=express.Router()

router.post("/",categoriesController.createCategories)
router.get("/",categoriesController.getAllCategory)
router.patch("/:id",categoriesController.updateCategory)
router.delete("/:id",categoriesController.deleteCategory)

export const categoriesRouter=router