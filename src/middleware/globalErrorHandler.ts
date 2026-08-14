/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";

interface TErrorSource {
  path: string;
  message: string;
}

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler: ", err);
  }
  const errorSources: TErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let errorMessage: string = "internal server error";
  const errorDetails: any = err;

  //zod validation error
  if (err instanceof z.ZodError) {
    statusCode = status.BAD_REQUEST;
    errorMessage = "Zod validation Error";
    err.issues.forEach((issue) => {
      errorSources.push({
        path: issue.path.join(" => ") || "Unknown",
        message: issue.message,
      });
    });
  }
  //prismaClientValidationError
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
    errorMessage = "you provide incorrect field type or missing fields";
  }
  //PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = status.NOT_FOUND;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found";
    } else if (err.code === "P2002") {
      statusCode = status.CONFLICT;
      errorMessage = "Duplicate kye error";
    } else if (err.code === "P2003") {
      statusCode = status.BAD_REQUEST;
      errorMessage = "Foreign  kye constraint failed";
    }
  }
  //PrismaClientUnknownRequestError
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  }
  //PrismaClientRustPanicError
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = status.BAD_REQUEST;
    errorMessage =
      "The error message usually provides details about where in the internal Rust code the panic occurred, which often points to a bug in Prisma's engines rather than a user configuration error (unless the configuration is fundamentally invalid";
  }
  //PrismaClientInitializationError
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = status.UNAUTHORIZED;
      errorMessage = "Authentication failed . please check your credentials !";
    } else if (err.errorCode === "P1001") {
      statusCode = status.SERVICE_UNAVAILABLE;
      errorMessage = "Can't reach database server !";
    }
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errorSources,
    ...(process.env.NODE_ENV !== "production" && { error: errorDetails }),
  });
}

export default errorHandler;
