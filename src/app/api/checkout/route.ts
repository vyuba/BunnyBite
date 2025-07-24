// src/app/checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: "/confirmation?checkout_id={CHECKOUT_ID}",
  server: "sandbox", // Use this option if you're using the sandbox environment - else use 'production' or omit the parameter
});
