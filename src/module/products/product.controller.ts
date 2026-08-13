import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { productService } from "./product.service";
import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.createProduct(req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "product create successfully",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getAllProduct(req.query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "product fetching successfully",
    data: result,
  });
});


const getProductById = catchAsync(async (req: Request, res: Response) => {
    const {id}=req.params
  const result = await productService.getProductById(id as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "product fetching successfully",
    data: result,
  });
});



const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const {id}=req.params
  const result = await productService.updateProduct(id as string,req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "product update successfully",
    data: result,
  });
});
export const productController = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct
};
