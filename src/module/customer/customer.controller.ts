import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { customerService } from "./customer.service";
import { sendResponse } from "../../shared/sentResponse";
import status from "http-status";


const getAllCustomer=catchAsync(async(req:Request,res:Response)=>{
    const result=await customerService.getAllCustomer()
    sendResponse(res,{
        success:true,
        httpStatusCode:status.OK,
        message:"Customer fetching successfully",
        data:result
    })
})




export const customerController={
getAllCustomer
}