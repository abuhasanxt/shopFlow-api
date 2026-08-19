import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  OrderStatus,
  PaymentStatus,
  Role,
} from "../../../generated/prisma/enums";
import { randomUUID } from "crypto";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";

// pay now order
const createOrder = async (userId: string) => {
  const order = await prisma.$transaction(async (tx) => {
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
      throw new AppError(status.NOT_FOUND, "Cart not found");
    }

    // 3. Empty cart check
    if (cart.items.length === 0) {
      throw new AppError(status.BAD_REQUEST, "Cart is empty");
    }

    // Order items prepare
    const orderItems = [];
    let totalAmount = 0;

    // 4. Process every cart item
    for (const item of cart.items) {
      const product = item.product;

      // Product active check
      if (!product.isActive) {
        throw new AppError(status.BAD_REQUEST, `${product.name} is not active`);
      }

      // Quantity validation
      if (item.quantity <= 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Invalid quantity for ${product.name}`,
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
          `Insufficient stock for ${product.name}`,
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
    return order;
  });

  //  Stripe call OUTSIDE transaction
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Order with ${order.items.length} item(s)`,
            },
            unit_amount: order.totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id,
      },
      success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,
      cancel_url: `${envVars.FRONTEND_URL}/dashboard/order`,
    });
  } catch (error) {
    console.error(error);
    // Stripe session failed
    await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create Stripe payment session",
    );
  }

  // Stripe PaymentIntent check
  if (typeof session.payment_intent !== "string") {
    await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Stripe PaymentIntent was not created",
    );
  }

  //create payment
  const transactionId = randomUUID();
  let paymentData;
  try {
    paymentData = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        transactionId,
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,
        currency: "bdt",
        status: PaymentStatus.UNPAID,
      },
    });
  } catch (error) {
    // Payment creation failed
    console.error(error);
    await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create payment record",
    );
  }

  // 10. Return order
  return {
    order,
    paymentData,
    paymentUrl: session.url,
  };
};

const getAllOrder = async (userId: string, role: Role) => {
  const result = await prisma.order.findMany({
    where:
      role === Role.ADMIN
        ? {}
        : {
            userId,
          },

    include: {
      items: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (result.length === 0) {
    throw new AppError(status.NOT_FOUND, "No orders found");
  }

  return result;
};

const getOrderById = async (userId: string, role: Role, id: string) => {
  const result = await prisma.order.findFirst({
    where: {
      id,
      ...(role !== Role.ADMIN && {
        userId,
      }),
    },

    include: {
      items: true,
      user: true,
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Order not found");
  }

  return result;
};

const orderWithPayLater = async (userId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Get user's cart
    const cart = await tx.cart.findUniqueOrThrow({
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

    if (cart.items.length === 0) {
      throw new AppError(status.BAD_REQUEST, "Cart is empty");
    }

    const orderItems = [];
    let totalAmount = 0;

    // 2. Process cart items
    for (const item of cart.items) {
      const product = item.product;

      if (!product.isActive) {
        throw new AppError(status.BAD_REQUEST, `${product.name} is not active`);
      }

      if (item.quantity <= 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Invalid quantity for ${product.name}`,
        );
      }

      // Atomic stock decrement
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

      if (updatedStock.count === 0) {
        throw new AppError(
          status.BAD_REQUEST,
          `Insufficient stock for ${product.name}`,
        );
      }

      const itemTotal = product.price * item.quantity;

      totalAmount += itemTotal;

      // Price snapshot
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 3. Create order
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

    // 4. Clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
    //create payment
    const transactionId = randomUUID();
    const paymentData = await tx.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        transactionId,
        paymentIntentId: `paylater-${transactionId}`,
        currency: "bdt",
      },
    });

    return { order, paymentData };
  });

  return result;
};

const initiatePayment = async (userId: string, orderId: string) => {
  const orderData = await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
      payment: true,
    },
  });

  if (!orderData.payment) {
    throw new AppError(status.NOT_FOUND, "Payment not found for this order");
  }

  if (orderData.payment?.status === PaymentStatus.PAID) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment already completed for this order",
    );
  }

  if (orderData.status === OrderStatus.CANCELLED) {
    throw new AppError(status.BAD_REQUEST, "Order is canceled");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Order with ${orderData.items.length} item(s)`,
          },
          unit_amount: orderData.totalAmount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: orderData.id,
      paymentId: orderData.payment?.id,
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/order`,
  });

  await prisma.payment.update({
    where: {
      id: orderData.payment.id,
    },

    data: {
      stripeSessionId: session.id,

      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined,
    },
  });
  return {
    paymentUrl: session.url,
  };
};

const cancelUnpaidOrders = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unpaidOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        lte: thirtyMinutesAgo,
      },
      status:OrderStatus.PENDING,
      payment:{
        status:PaymentStatus.UNPAID
      }
    },
    select:{
      id:true,
      items: {
        select: {
          productId: true,
          quantity: true,
        },
      },
    }
  });

  if (unpaidOrders.length === 0) {
    return;
  }

  const orderIds=unpaidOrders.map(order=>order.id)

  await prisma.$transaction(async(tx)=>{


 // 1. Restore product stock
    for (const order of unpaidOrders) {
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },

          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }


    await tx.order.updateMany({
      where:{
        id:{
          in:orderIds
        }
      },
      data:{
        status:OrderStatus.CANCELLED
      }
    });

await tx.payment.deleteMany({
  where:{
    orderId:{
      in:orderIds
    }
  }
});



  })
 
};
export const orderService = {
  createOrder,
  getAllOrder,
  getOrderById,
  orderWithPayLater,
  initiatePayment,
  cancelUnpaidOrders
};
