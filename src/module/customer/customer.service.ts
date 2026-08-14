import status from "http-status"
import { Role } from "../../../generated/prisma/enums"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"

const getAllCustomer=async()=>{
    const result=await prisma.user.findMany({
        where:{
            role:Role.CUSTOMER
        }
    })
    return result
}

const getMe=async(userId:string)=>{
    const result=await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    return result
}


const getById =async(id:string)=>{
    const result=await prisma.user.findUnique({
        where:{id:id}
    })
    if (!result) {
        throw new AppError(status.NOT_FOUND,"Customer not Found")
    }
    return result
}

interface UserData{
    name:string,
    image:string
}
const updateMe=async(id:string,payload:UserData)=>{
const existingUser=await prisma.user.findFirst({
    where:{id}
})
if (!existingUser) {
    throw new AppError(status.NOT_FOUND,"User not found")
}



  if (Object.keys(payload).length === 0) {
    throw new AppError(status.BAD_REQUEST,"Please provide at least one field to update");
  }

  const isSame =
    (payload.name === undefined || payload.name === existingUser.name) &&
    (payload.image === undefined ||
      payload.image === existingUser.image);

  if (isSame) {
    throw new AppError(status.CONFLICT,"Your provided data is already up to date");
  }

    const result=await prisma.user.update({
        where:{
           id
        },
        data: payload
    })
    return result
}



const deleteMe=async(id:string)=>{
    const result=await prisma.user.delete({
        where:{id:id}
    })
    if (!result) {
        throw new AppError(status.NOT_FOUND,"User not found")
    }
    return result
}

export const customerService={
    getAllCustomer,
    getMe,
    getById,
    updateMe,
    deleteMe
}