import { auth } from "../../lib/auth";

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
    throw new Error("Failed to register customer");
  }
  return result;
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
  return result;
};

export const userService = {
  registerCustomer,
  loginUser,
};
