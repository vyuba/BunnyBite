// src/app/checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  server: "sandbox",
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: "/confirmation?checkout_id={CHECKOUT_ID}",
});
