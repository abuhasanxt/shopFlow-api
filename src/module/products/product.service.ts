import { prisma } from "../../lib/prisma";

interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  isActive?: boolean;
}

const createProduct = async (
  payload: Omit<ProductData, "id" | "createdAt" | "updatedAt">,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const result = await prisma.product.create({
    data: payload,
  });
  return result;
};


const getAllProduct=async()=>{
    const result=await prisma.product.findMany()
    return result
}
export const productService = {
  createProduct,
  getAllProduct
};
