import dotenv from "dotenv";
import Stripe from "stripe";

import { updateOrderPaymentStatus, saveOrderAddresses } from "./ordersController.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  console.log("Webhook hit:", sig);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let session;
  let orderId;

  switch (event.type) {
    case "checkout.session.completed":
      console.log("checkout.session.completed event received");

      session = event.data.object;
      console.log("Metadata:", session.metadata);
      orderId = session.metadata.orderId;
      console.log("Order ID from metadata:", orderId);

      await saveOrderAddresses(orderId, {
        email: session.customer_details.email,
        name: session.customer_details.name,
        phone: session.customer_details.phone,
        shippingAddress: session.customer_details.address,
        billingAddress: session.shipping?.address
      });
      await updateOrderPaymentStatus(orderId, "paid");

      break;

    case "payment_intent.payment_failed":
      console.log("payment_intent.payment_failed event received");

      session = event.data.object;
      console.log("Payment failed:", session.id);

      orderId = session.metadata.orderId; 
      console.log("Order ID from metadata:", orderId);

      await updateOrderPaymentStatus(orderId, "cancelled");
      break;

    case "payment_intent.succeeded":
      console.log("payment_intent.succeeded event received");
      break;

    case "charge.succeeded":
      console.log("charge.succeeded event received");
      break;

    case "payment_intent.created":
      console.log("payment_intent.created event received");
      break;

    case "charge.updated":
      console.log("charge.updated event received");
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};