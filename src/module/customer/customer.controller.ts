import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { customerService } from "./customer.service";
import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";

const getAllCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await customerService.getAllCustomer();
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Customers fetching successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await customerService.getMe(userId as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Fetching my profile",
    data: result,
  });
});



const getById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params
  const result = await customerService.getMe(id as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Customer Fetching successfully",
    data: result,
  });
});



const updateMe = catchAsync(async (req: Request, res: Response) => {
  const userId= req.user?.userId

  const result = await customerService.updateMe(userId as string,req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Update successfully",
    data: result,
  });
});




const deleteMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId
  const result = await customerService.deleteMe(userId as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Delete successfully",
    data: result,
  });
});


export const customerController = {
  getAllCustomer,
  getMe,
  getById,
  updateMe,
  deleteMe
};
