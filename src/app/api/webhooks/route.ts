import { shopify } from "@/app/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

// Required to read the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw body
async function getRawBody(req: NextRequest) {
  if (!req.body) return null;
  const reader = req.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export const POST = async (req: NextRequest) => {
  console.log("Webhook Received!");
  const handlers = shopify.webhooks.getHandlers("APP_UNINSTALLED");
  // e.g. handlers[0].deliveryMethod
  console.log("this is the webhook handlers", handlers);
  const topics = shopify.webhooks.getTopicsAdded();
  console.log("this is the webhook topics", topics);
  try {
    const rawBody = await getRawBody(req);

    if (!rawBody) {
      return new NextResponse("No raw body found", { status: 400 });
    }

    await shopify.webhooks.process({
      rawBody,
      rawRequest: req,
      rawResponse: NextResponse,
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
};
