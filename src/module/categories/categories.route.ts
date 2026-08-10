import express from "express"
import { categoriesController } from "./categories.controller"


const router=express.Router()

router.post("/",categoriesController.createCategories)

export const categoriesRouter=router