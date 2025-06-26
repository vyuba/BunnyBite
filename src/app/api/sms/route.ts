import { NextRequest, NextResponse } from "next/server";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
// import { createMessage } from "@/app/lib/twillio";
// import { TwillioClient } from "@/app/lib/twillio";
import { databases } from "@/app/lib/node-appwrite";
import { ID, Permission, Role } from "node-appwrite";
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
  const twiml = new MessagingResponse();
  const bodyText = await req.text();
  console.log(typeof bodyText);
  const params = new URLSearchParams(bodyText);
  console.log(params);

  const from = params.get("From"); // sender's number (e.g., 'whatsapp:+234...')
  const body = params.get("Body"); // message text
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
  await databases.createDocument(
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
    ID.unique(),
    {
      sender_type: "customer",
      content: body,
      messageId: ID.unique(),
      shop_name: "customthem.myshopify.com",
      Receiver_id: "customthem.myshopify.com",
      chat_id: "batman",
    },
    [
      Permission.read(Role.user("684e2a400021d564a828")),
      Permission.write(Role.user("684e2a400021d564a828")),
      Permission.update(Role.user("684e2a400021d564a828")),
    ]
  );

  return new NextResponse(twiml.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
};
