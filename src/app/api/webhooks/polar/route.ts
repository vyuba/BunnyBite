// src/app/api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onPayload: async (payload) => console.log(payload),
  onOrderCreated: async (order) => console.log(order),
  onCustomerStateChanged: async (customerState) => console.log(customerState),
});
