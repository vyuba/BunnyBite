import { NextRequest, NextResponse } from "next/server";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
import { ID, Permission, Query, Role } from "node-appwrite";
import { initTwilio } from "@/app/lib/twillio";
export const runtime = "nodejs"; // ensure Node, not Edge

export const POST = async (req: NextRequest) => {
  let twilioClient: Awaited<ReturnType<typeof initTwilio>> | null = null;
  let customerNumber = "";
  let shopNumber = "";

  try {
    const { adminDatabase } = await CreateAdminClient();

    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    customerNumber = params.get("From") || "";
    const content = params.get("Body") || "";
    const customer_name = params.get("ProfileName") || "";
    const messageSid = params.get("MessageSid") || ID.unique();
    const repliedMessage = params.get("OriginalRepliedMessageSid") || null;
    shopNumber = params.get("To") || "";
    const messageType = params.get("MessageType") || "text";

    const shopResponse = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      [Query.equal("shop_number", shopNumber)]
    );
    const shopDoc = shopResponse.documents[0];
    if (!shopDoc) {
      return new NextResponse("Shop not found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
    if (!shopDoc.twillio_auth_token || !shopDoc.twillio_account_siid) {
      return new NextResponse("Missing Twilio credentials for shop", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      });
    }

    twilioClient = await initTwilio(
      shopDoc.twillio_account_siid,
      shopDoc.twillio_auth_token
    );

    if (messageType !== "text") {
      await twilioClient.messages.create({
        body: "We can only accept text currently, thank you.",
        from: shopNumber,
        to: customerNumber,
      });
      return new NextResponse("OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const chats = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      [
        Query.equal("shop_phone", shopNumber),
        Query.equal("customer_phone", customerNumber),
      ]
    );

    let chatDoc = chats.documents[0];
    if (!chatDoc) {
      const newChatId = ID.unique();
      chatDoc = await adminDatabase.createDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
        ID.unique(),
        {
          customer_phone: customerNumber,
          customer_name,
          chat_id: newChatId,
          shop_phone: shopNumber,
          unseen_messages: 0,
          isAIActive: false,
        },
        [Permission.read(Role.any())]
      );
    }
    const chat_id: string = String(chatDoc.chat_id);

    const storedMsg = await adminDatabase.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      messageSid,
      {
        sender_type: "customer",
        content,
        messageId: ID.unique(),
        Receiver_id: shopDoc.shop,
        chat_id,
        replied_msg: repliedMessage,
        customer_number: customerNumber,
        shop_phone: shopNumber,
        shop_id: shopDoc.$id,
      },
      [Permission.read(Role.any())]
    );

    const unseen = Number(chatDoc.unseen_messages ?? 0) + 1;
    await adminDatabase.updateDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      chatDoc.$id,
      { unseen_messages: unseen }
    );

    const tokensFunded = Math.max(0, Number(shopDoc.tokensFunded ?? 0));
    const tokensUsed = Math.max(0, Number(shopDoc.tokensUsed ?? 0));
    const tokenAvailable = Math.max(0, tokensFunded - tokensUsed);

    const aiActive = Boolean(chatDoc.isAIActive);
    const HAS_LOW_TOKENS = tokenAvailable <= 10000;

    if (aiActive && HAS_LOW_TOKENS) {
      const resp = await fetch(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!}/api/agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender_type: "shop",
            content,
            messageId: ID.unique(),
            Receiver_id: storedMsg.Receiver_id,
            chat_id: storedMsg.chat_id,
            customer_number: customerNumber,
            shop_phone: shopNumber,
            shop_id: storedMsg.shop_id,
            twillio_account_siid: shopDoc.twillio_account_siid,
            twillio_auth_token: shopDoc.twillio_auth_token,
          }),
        }
      );
      const aiJson = await resp.json();
      return new NextResponse(JSON.stringify(aiJson), {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse("", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error(err);
    if (twilioClient && customerNumber && shopNumber) {
      try {
        await twilioClient.messages.create({
          body: "Try again in a few minutes. Thank you.",
          from: shopNumber,
          to: customerNumber,
        });
      } catch {}
    }
    return new NextResponse("Internal Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
