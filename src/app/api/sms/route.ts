import { NextRequest, NextResponse } from "next/server";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
// import { createMessage } from "@/app/lib/twillio";
// import { TwillioClient } from "@/app/lib/twillio";
import { createClient } from "@/app/lib/node-appwrite";
import { ID, Query } from "node-appwrite";
// import { createHmac } from "crypto";
// import { graph } from "@/agent/model";
// import { Command } from "@langchain/langgraph";

// export const GET = async (req: NextRequest, res: NextResponse) => {
//   console.log("sms route hit");
//   const reponse = await TwillioClient.messages.create({
//     body: "Hello from Twilio",
//     from: "whatsapp:+14155238886",
//     to: "whatsapp:+2349161076598",
//   });
//   console.log(reponse);
//   return new NextResponse(reponse.body, {
//     status: 200,
//     headers: { "Content-Type": "text/xml" },
//   });
// };

export const POST = async (req: NextRequest) => {
  const { databases } = await createClient();
  const twiml = new MessagingResponse();
  const bodyText = await req.text();
  console.log(typeof bodyText);
  const params = new URLSearchParams(bodyText);
  console.log(params);

  const from = params.get("From"); // sender's number (e.g., 'whatsapp:+234...')
  const body = params.get("Body"); // message text
  const customer_name = params.get("ProfileName");
  const to = params.get("To"); // your Twilio number
  console.log("from:", from);
  console.log("body:", body);
  console.log("to:", to);

  // twiml.message(response.output);

  // const response = await fetch(
  //   "https://personally-version-algorithm-singles.trycloudflare.com/api/agent",
  //   {
  //     method: "POST",
  //     // headers: {
  //     //   "Content-Type": "application/json",
  //     // },
  //     body: JSON.stringify({
  //       sender_type: message.sender_type,
  //       content: payload?.content,
  //       messageId: ID.unique(),
  //       shop_name: message.shop_name,
  //       Receiver_id: message.Receiver_id,
  //       chat_id: message.chat_id,
  //     }),
  //   }
  // );
  //   twiml.message("The Robots are coming! Head for the hills!");
  const isChatAvailable = await databases.listDocuments(
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
    [Query.equal("shop_phone", to), Query.equal("customer_phone", from)]
  );

  let newChatId = isChatAvailable.documents[0]?.chat_id;
  let newChat = isChatAvailable.documents[0];
  if (isChatAvailable.total === 0) {
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      ID.unique(),
      {
        customer_phone: from,
        customer_name,
        chat_id: ID.unique(),
        shop_phone: to,
      }
    );
    newChat = response;
    newChatId = response?.chat_id;
  }

  const message = await databases.createDocument(
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
    ID.unique(),
    {
      sender_type: "customer",
      content: body,
      messageId: ID.unique(),
      Receiver_id: "customthem.myshopify.com",
      chat_id: newChatId,
      customer_number: from,
      shop_phone: to,
    }
    // [
    //   Permission.read(Role.user("684e2a400021d564a828")),
    //   Permission.write(Role.user("684e2a400021d564a828")),
    //   Permission.update(Role.user("684e2a400021d564a828")),
    // ]
  );

  if (newChat?.isAIActive === true) {
    const response = await fetch(
      `https://${
        process.env.NEXT_PUBLIC_SHOPIFY_APP_URL || "bunny-bite.vercel.app"
      }/api/agent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_type: "shop",
          content: body,
          messageId: ID.unique(),
          Receiver_id: message.Receiver_id,
          chat_id: message.chat_id,
          customer_number: from,
          shop_phone: to,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  }

  return new NextResponse(twiml.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
};
