import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../shared/catchAsync";

import { sendResponse } from "../../shared/sentResponse";
import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        status.UNAUTHORIZED,
        "You are Unauthorized"
      );
    }

    const result = await orderService.createOrder(userId);

    sendResponse(res, {
      success: true,
      httpStatusCode: status.CREATED,
      message: "Order created successfully",
      data: result,
    });
  }
);

export const orderController={
    createOrder
}