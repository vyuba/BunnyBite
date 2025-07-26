import { NextRequest, NextResponse } from "next/server";
import { TwillioClient } from "@/app/lib/twillio";
import { createHmac } from "crypto";

export const POST = async (req: NextRequest) => {
  //Getting the payload from the request

  const payload = await req.text();

  //Getting the signature from the header

  const signatureHeader = req.headers.get("x-appwrite-webhook-signature")!;

  const webhookUrl = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!;
  const signatureKey = process.env.YOUR_SECRET_HMAC_KEY!;

  // Hashing the the signature key i got with my webhook and payload to verify

  const expectedSignature = createHmac("sha1", signatureKey)
    .update(
      `https://${webhookUrl}/api/webhooks/appwrite/send-message${payload}`
    )
    .digest("base64");

  // Comparing the hash with the signature gotten from the header

  if (expectedSignature !== signatureHeader) {
    console.error("Webhook verification failed");
    return new Response("Unauthorized", { status: 401 });
  }

  // if sucessfull parse the payload

  const json = JSON.parse(payload);

  // Send only if its the shop that sent the message

  if (json?.sender_type !== "customer") {
    const reponse = await TwillioClient.messages.create({
      body: json?.content,
      from: json?.shop_phone,
      to: json?.customer_number,
    });
    console.log(reponse);
    return new NextResponse(reponse.body, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
};
