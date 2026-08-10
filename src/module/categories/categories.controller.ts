/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { categoriesService } from "./categories.service";

 

 const createCategories= async (req:Request,res:Response)=>{
    try {
         const result =await categoriesService.createCategories(req.body)

         res.status(201).json({
            success:false,
            message:"Category Create successfully!",
            data:result
         })
    } catch (error: any) {
        res.status(201).json({
            success:false,
            message:"Category Create successfully!",
            error:error.message,
            details:error
         })
    }
 }


 export const categoriesController={
    createCategories
 }