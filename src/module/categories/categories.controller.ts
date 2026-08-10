/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { categoriesService } from "./categories.service";

 

 const createCategories= async (req:Request,res:Response)=>{
    try {
         const result =await categoriesService.createCategories(req.body)

         res.status(201).json({
            success:true,
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



 const getAllCategory=async(req:Request,res:Response)=>{
  try {
    const result=await categoriesService.getAllCategory()
    res.status(200).json({
      success:true,
      message:"Categories retrieved successfully!",
      data:result
    })
  } catch (error:any) {
   res.status(401).json({
      success:false,
      message:"Categories retrieved failed",
      error:error.message,
      details:error
   })
  }

 }

 const updateCategory=async(req:Request,res:Response)=>{
   try {
      const {id}=req.params
      const result=await categoriesService.updateCategory(id as string,req.body)
      res.status(201).json({
         success:true,
         message:"Category update successfully",
         data:result
      })

   } catch (error:any) {
      res.status(500).json({
         success:false,
         message:"category update failed",
         error:error.message,
         details:error
      })
   }
 }



 const deleteCategory=async(req:Request,res:Response)=>{
   try {
      const {id}=req.params
      const result=await categoriesService.deleteCategory(id as string)
      res.status(200).json({
         success:true,
         message:"category delete successfully",
         data:result
      })
   } catch (error:any) {
      res.status(500).json({
         success:false,
         message:"Delete failed",
         error:error.message,
         details:error
      })
   }
 }
 export const categoriesController={
    createCategories,
    getAllCategory,
    updateCategory,
    deleteCategory
 }