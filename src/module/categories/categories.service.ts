import status from "http-status"
import { Category } from "../../../generated/prisma/client"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"


const createCategories = async(data:Omit<Category,"id" |"createdAt" |"updatedAt" | "authorId">)=>{
    const result=await prisma.category.create({
        data:{
            ...data
        }
    })
    return result
}

const getAllCategory=async()=>{
    const result=await prisma.category.findMany()
    return result
}

 type updateCategoryData ={
    name:string
}
const updateCategory=async(id:string,data:updateCategoryData)=>{
    const existingCategory=await prisma.category.findFirst({where:{id}})
    if (!existingCategory) {
        throw new AppError(status.NOT_FOUND,"Category not found")
    }
    const result=await prisma.category.update({
        where:{
            id
        },data
    })
    return result
}

const deleteCategory=async(id:string)=>{
const existingCategory=await prisma.category.findFirst({
    where:{id}
})

if (!existingCategory) {
    throw new AppError(status.NOT_FOUND,"Category not found")
}
    const result=await prisma.category.delete({
        where:{
            id
        }
    })
    return result
}


export const categoriesService = {
    createCategories,
    getAllCategory,
    updateCategory,
    deleteCategory
}