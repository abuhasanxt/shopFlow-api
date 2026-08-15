import status from "http-status"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"

const addToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  //  Product check
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found");
  }

  //  Product active 
  if (!product.isActive) {
    throw new AppError(status.BAD_REQUEST, "Product is not active");
  }

  //  Stock check
  if (product.stock < quantity) {
    throw new AppError(status.BAD_REQUEST, "Insufficient stock");
  }

  //  User- cart  create 
  const cart = await prisma.cart.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  });

  //  Cart- product  check
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  //  quantity update
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new AppError(
        status.BAD_REQUEST,
        "Requested quantity exceeds available stock"
      );
    }

    return await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });
  }

  // item create
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};


export const cardService={
    addToCart
}