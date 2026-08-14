import dotenv from "dotenv";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV:string,
  DATABASE_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariable = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
  ];
  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file`,
      );
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV:process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
  };
};
export const envVars = loadEnvVariables();
