import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./auth.service";
import { sendResponse } from "../../shared/sentResponse";

const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.registerCustomer(req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: 200,
    message: "User Create successfully",
    data: result,
  });
});

export const userController = {
  registerCustomer,
};
