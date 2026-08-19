import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../shared/catchAsync";

import { sendResponse } from "../../shared/sentResponse";
import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "You are Unauthorized");
  }

  const result = await orderService.createOrder(userId);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "You are Unauthorized");
  }

  const result = await orderService.getAllOrder(userId, role);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Order fetching successfully",
    data: result,
  });
});


const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const {id}=req.params

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "You are Unauthorized");
  }

  const result = await orderService.getOrderById(userId, role,id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Order fetching successfully",
    data: result,
  });
});

const orderWithPayLater=catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "You are Unauthorized");
  }
  const result = await orderService.orderWithPayLater(
    userId, 
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Order create successfully with Pay Later option",
    data: result,
  });
});



const initiatePayment=catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const orderId=req.params.id

  if (!userId) {
    throw new AppError(status.UNAUTHORIZED, "You are Unauthorized");
  }
  const result = await orderService.initiatePayment(
    userId, 
    orderId as string
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Payment Initiated Successfully",
    data: result,
  });
});
export const orderController = {
  createOrder,
  getAllOrder,
  getOrderById,
  orderWithPayLater,
  initiatePayment
};
