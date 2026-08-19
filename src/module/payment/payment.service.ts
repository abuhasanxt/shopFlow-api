/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { OrderStatus, PaymentStatus } from "../../../generated/prisma/enums";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed . Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      const paymentId = session.metadata?.paymentId;

      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return { message: "Missing orderId or paymentId in session metadata" };
      }

      //check order
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });
      if (!order) {
        console.error(`Order with id ${orderId} not found`);
        return { message: `Order with id ${orderId} not found` };
      }

      // Check Payment
      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

      if (!payment) {
        console.error(`Payment with id ${paymentId} not found`);

        return { message: `Payment with id ${paymentId} not found` };
      }

      const paymentStatus =
        session.payment_status === "paid"
          ? PaymentStatus.PAID
          : PaymentStatus.UNPAID;

      const orderStatus =
        session.payment_status === "paid"
          ? OrderStatus.PAID
          : OrderStatus.PENDING;


         const paymentIntentId =
        typeof session.payment_intent ===
        "string"
          ? session.payment_intent
          : null;

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: paymentStatus,
            paymentIntentId,
            stripeEventId: event.id,
            paymentGatewayData: session as any,
          },
        });

        await tx.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: orderStatus,
          },
        });
      });

      console.log(
        `Processed checkout.session.completed for order ${orderId} and payment ${paymentId} `,
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(
        `checkout session ${session.id} expired. Marking associated payment as failed`,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

      console.log(
        `Payment intent ${paymentIntent.id} failed. Marking associated payment as failed`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const paymentService = {
  handlerStripeWebhookEvent,
};
