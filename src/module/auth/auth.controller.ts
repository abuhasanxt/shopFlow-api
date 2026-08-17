import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { authService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { cookiesUtils } from "../../utils/cookie";

const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerCustomer(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "User Create successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User login successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token is Missing");
  }

  if (!betterAuthSessionToken) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Better Auth session token is Missing",
    );
  }

  const result = await authService.getNewToken(
    refreshToken,
    betterAuthSessionToken,
  );

  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken,
    },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.logoutUser(betterAuthSessionToken);

  cookiesUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  cookiesUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  cookiesUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "User logged out successfully",
    data: result
  });
});



const emailVerify = catchAsync(async (req: Request, res: Response) => {
  const {email,otp}=req.body
  await authService.verifyEmail(email,otp)


  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Email verified successfully",
    
  });
});


const googleLogin = catchAsync(async (req: Request, res: Response) => {
 


  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Google login successfully",
    
  });
});


const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {



  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Email verified successfully",
    
  });
});

const handleOAuthError = catchAsync(async (req: Request, res: Response) => {
  

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Email verified successfully",
    
  });
});

export const authController = {
  registerCustomer,
  loginUser,
  getNewToken,
  logoutUser,
  emailVerify,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError
};
