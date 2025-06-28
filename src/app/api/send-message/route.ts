// import { databases } from "@/app/lib/node-appwrite";
// import { ID, Permission, Role } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { TwillioClient } from "@/app/lib/twillio";
import { createHmac } from "crypto";
// import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

export const POST = async (req: NextRequest) => {
  const payload = await req.text(); // use .text(), not .json(), for exact signature match
  const signatureHeader = req.headers.get("x-appwrite-webhook-signature")!;
  const webhookUrl = "knife-hospitality-subjects-sciences.trycloudflare.com"; // full path that Appwrite posts to
  const signatureKey = process.env.YOUR_SECRET_HMAC_KEY!;

  const expectedSignature = createHmac("sha1", signatureKey)
    .update(`https://${webhookUrl}/api/send-message${payload}`)
    .digest("base64");

  if (expectedSignature !== signatureHeader) {
    console.error("Webhook verification failed");
    return new Response("Unauthorized", { status: 401 });
  }

  const json = JSON.parse(payload);
  // console.log("Verified webhook:", json);
  // console.log("Document created:", payload);

  //   const document = payload; // entire document object
  // const id = json.$id; // auto-generated document ID
  // console.log("Document created:", json);
  // console.log("Document ID:", id);
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
  return NextResponse.json({ message: "Successfull" }, { status: 200 });
};
