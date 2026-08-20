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
    name?:string,

}
const updateMe=async(userId:string,payload:UserData,file?:Express.Multer.File)=>{
const existingUser=await prisma.user.findFirst({
    where:{id:userId}
})
if (!existingUser) {
    throw new AppError(status.NOT_FOUND,"User not found")
}

 const updateData: {
    name?: string;
    image?: string;
  } = {};

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  // Cloudinary image
  if (file) {
    updateData.image = file.path;
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(status.BAD_REQUEST,"Please provide at least one field to update");
  }

  const isSame =
    (updateData.name === undefined || updateData.name === existingUser.name) &&
    (updateData.image === undefined ||
      updateData.image === existingUser.image);

  if (isSame) {
    throw new AppError(status.CONFLICT,"Your provided data is already up to date");
  }

    const result=await prisma.user.update({
        where:{
           id:userId
        },
        data: updateData
    })
    return result
}



const deleteMe=async(userId:string)=>{
    const result=await prisma.user.delete({
        where:{id:userId}
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