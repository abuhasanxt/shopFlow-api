import { Category } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const createCategories = async(data:Omit<Category,"id" |"createdAt" |"updatedAt" | "authorId">)=>{
    const result=await prisma.category.create({
        data:{
            ...data
        }
    })
    return result
}


export const categoriesService = {
    createCategories
}