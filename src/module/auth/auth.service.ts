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

export const userService = {
  registerCustomer,
};
