import { Request, Response } from "express";
import { categoriesService } from "./categories.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";



const createCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoriesService.createCategories(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Category Create successfully",
    data: result,
  });
});


const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoriesService.getAllCategory();
  sendResponse(res,{
   httpStatusCode:status.OK,
   success:true,
   message:"Categories fetching successfully",
   data:result
  })
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoriesService.updateCategory(id as string, req.body);
  sendResponse(res,{
   httpStatusCode:status.CREATED,
   success:true,
   message:"Category update successfully",
   data:result
  })
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoriesService.deleteCategory(id as string);
   sendResponse(res,{
   httpStatusCode:status.OK,
   success:true,
   message:"Category Delete successfully",
   data:result
  })
});
export const categoriesController = {
  createCategories,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
