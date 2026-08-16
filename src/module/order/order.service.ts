import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

const createOrder = async (userId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Get user's cart with products
    const cart = await tx.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // 2. Cart check
    if (!cart) {
      throw new AppError(
        status.NOT_FOUND,
        "Cart not found"
      );
    }

    // 3. Empty cart check
    if (cart.items.length === 0) {
      throw new AppError(
        status.BAD_REQUEST,
        "Cart is empty"
      );
    }

    // Order items prepare
    const orderItems = [];
    let totalAmount = 0;

    // 4. Process every cart item
    for (const item of cart.items) {
      const product = item.product;

      // Product active check
      if (!product.isActive) {
        throw new AppError(
          status.BAD_REQUEST,
          `${product.name} is not active`
        );
      }

      // Quantity validation
      if (item.quantity <= 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Invalid quantity for ${product.name}`
        );
      }

      // 5. Atomic stock decrement
      const updatedStock = await tx.product.updateMany({
        where: {
          id: product.id,
          stock: {
            gte: item.quantity,
          },
          isActive: true,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      // If no product updated, stock was insufficient
      if (updatedStock.count === 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Insufficient stock for ${product.name}`
        );
      }

      // 6. Calculate item total
      const itemTotal = product.price * item.quantity;

      totalAmount += itemTotal;

      // 7. Price snapshot
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 8. Create order + order items
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
      },
    });

    // 9. Clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    // 10. Return order
    return order;
  });

  return result;
};



export const orderService={
    createOrder
}