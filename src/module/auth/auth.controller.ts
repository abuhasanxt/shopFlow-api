import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./auth.service";
import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";

const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.registerCustomer(req.body);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "User Create successfully",
    data: result,
  });
});

const loginUser=catchAsync(async(req:Request,res:Response)=>{
  const result =await userService.loginUser(req.body)
  sendResponse(res,{
    success:true,
    httpStatusCode:status.OK,
    message:"User login successfully",
    data:result
  })

})

export const userController = {
  registerCustomer,
  loginUser
};
