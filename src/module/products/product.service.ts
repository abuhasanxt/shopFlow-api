/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import { ProductData, ProductQuery } from "./product.interface";

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

const getAllProduct = async (query: ProductQuery) => {
  const {
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    q,
    sort = "createdAt",
    order = "desc",
    page = "1",
    limit = "1",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const where: any = {};

  // category filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // price filter
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  // stock filter
  if (inStock === "true") {
    where.stock = {
      gt: 0,
    };
  }

  if (inStock === "false") {
    where.stock = {
      equals: 0,
    };
  }

  // search
  if (q) {
    where.OR = [
      {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

  // pagination
  const skip = (pageNumber - 1) * limitNumber;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        [sort]: order,
      },
      skip,
      take: limitNumber,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  if (products.length === 0) {
    throw new Error("Product not found");
  }

  return {
    products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getProductById = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  if (!result) {
    throw new Error("Product not found");
  }
  return result;
};
export const productService = {
  createProduct,
  getAllProduct,
  getProductById,
};
