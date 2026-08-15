import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { sendResponse } from "../../shared/sentResponse";
import { cardService } from "./cart.service";



const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  if (!userId) {
    throw new AppError(
      status.UNAUTHORIZED,
      "You are Unauthorized"
    );
  }

  const { productId, quantity } = req.body;

  const result = await cardService.addToCart(
    userId as string,
    productId,
    quantity
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Product added to cart successfully!",
    data: result,
  });
});


export const cartController={
    addToCart
}