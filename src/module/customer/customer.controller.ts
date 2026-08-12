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
    message: "Customer fetching successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
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

export const customerController = {
  getAllCustomer,
  getMe,
  getById
};
