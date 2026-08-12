import { Role } from "../../../generated/prisma/enums"
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
        throw new Error("Customer not Found")
    }
    return result
}



export const customerService={
    getAllCustomer,
    getMe,
    getById
}