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



export const customerService={
    getAllCustomer
}