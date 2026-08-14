import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";

export const handleZodError=(err:z.ZodError):TErrorResponse=>{
    const  statusCode = status.BAD_REQUEST;
    const errorMessage = "Zod validation Error";
   const errorSources: TErrorSources[]=[]

    err.issues.forEach((issue) => {
      errorSources.push({
        path: issue.path.join(" => ") || "Unknown",
        message: issue.message,
      });
})
return {
    success:false,
    errorMessage,
    errorSources,
    statusCode
}
}