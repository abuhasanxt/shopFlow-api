import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { authService } from "./auth.service";

const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerCustomer(req.body);
   const {accessToken,refreshToken,token,...rest}=result

  tokenUtils.setAccessTokenCookie(res,accessToken)
  tokenUtils.setRefreshTokenCookie(res,refreshToken)
  tokenUtils.setBetterAuthSessionCookie(res,token as string)
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "User Create successfully",
     data:{
      token,
      accessToken,
      refreshToken,
      ...rest,
     
    }
  });
});

const loginUser=catchAsync(async(req:Request,res:Response)=>{
  const result =await authService.loginUser(req.body)
  const {accessToken,refreshToken,token,...rest}=result

  tokenUtils.setAccessTokenCookie(res,accessToken)
  tokenUtils.setRefreshTokenCookie(res,refreshToken)
  tokenUtils.setBetterAuthSessionCookie(res,token)
  sendResponse(res,{
    success:true,
    httpStatusCode:status.OK,
    message:"User login successfully",
    data:{
      token,
      accessToken,
      refreshToken,
      ...rest,
     
    }
  })

})

export const authController = {
  registerCustomer,
  loginUser
};
