/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { categoriesService } from "./categories.service";
import { catchAsync } from "../../shared/catchAsync";

const createCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoriesService.createCategories(req.body);
  res.status(201).json({
    success: false,
    message: "Category create successfully",
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoriesService.getAllCategory();
  res.status(200).json({
    success: true,
    message: "Category fetch successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoriesService.updateCategory(id as string, req.body);
  res.status(200).json({
    success: true,
    message: "Category update successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoriesService.deleteCategory(id as string);
  res.status(200).json({
    success: true,
    message: "Delete successfully",
    data: result,
  });
});
export const categoriesController = {
  createCategories,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
