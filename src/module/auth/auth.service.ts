import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { tokenUtils } from "../../utils/token";

interface UserData {
  name: string;
  email: string;
  password: string;
}

const registerCustomer = async (payload: UserData) => {
  const { name, email, password } = payload;
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!result.user) {
    throw new AppError(status.BAD_REQUEST,"Failed to register customer");
  }

    const accessToken=tokenUtils.getAccessToken({
    userId:result.user.id,
    role:result.user.role,
    name:result.user.name,
    email:result.user.email,
    emailVerified:result.user.emailVerified


  })

  const refreshToken=tokenUtils.getRefreshToken({
      userId:result.user.id,
    role:result.user.role,
    name:result.user.name,
    email:result.user.email,
    emailVerified:result.user.emailVerified
  })
  return {
    ...result,
    accessToken,
    refreshToken
  };
};

interface UserLogin {
  email: string;
  password: string;
}

const loginUser = async (payload: UserLogin) => {
  const { email, password } = payload;
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  const accessToken=tokenUtils.getAccessToken({
    userId:result.user.id,
    role:result.user.role,
    name:result.user.name,
    email:result.user.email,
    emailVerified:result.user.emailVerified


  })

  const refreshToken=tokenUtils.getRefreshToken({
      userId:result.user.id,
    role:result.user.role,
    name:result.user.name,
    email:result.user.email,
    emailVerified:result.user.emailVerified
  })
  return {
    ...result,
    accessToken,
    refreshToken
  };
};

export const authService = {
  registerCustomer,
  loginUser,
};
