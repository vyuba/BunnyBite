import { NextRequest, NextResponse } from "next/server";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
import { ID, Permission, Query, Role } from "node-appwrite";
import { TwillioClient } from "@/app/lib/twillio";

export const POST = async (req: NextRequest) => {
  // fetching the admin database from the function

  const { adminDatabase } = await CreateAdminClient();

  //Converting the req into text format

  const body = await req.text();
  console.log(body);

  // Using UrlSearchParams to pars the body
  const params = new URLSearchParams(body);
  console.log(params);

  //Getting all the attribute from the urlsearchparams

  const customerNumber = params.get("From"); // sender's number (e.g., 'whatsapp:+234...')
  const content = params.get("Body"); // message text content
  const customer_name = params.get("ProfileName"); // profile name
  const messageSid = params.get("MessageSid"); // message sid
  const repliedMessage = params.get("OriginalRepliedMessageSid"); // replied message sid
  const shopNumber = params.get("To"); // shop twillio number

  console.log("CUSTOMER:", customerNumber);
  console.log("CONTENT:", content);
  console.log("SHOP:", shopNumber);
  const messageType = params.get("MessageType");
  console.log("MESSAGE-TYPE", messageType);

  // if statement to check if not text return we only accept text back

  try {
    if (messageType !== "text") {
      const reponse = await TwillioClient.messages.create({
        body: "We can only accept text currently, thank you",
        from: shopNumber,
        to: customerNumber,
      });

      return new NextResponse(reponse.body, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Checking if that chat room is available

    const isChatAvailable = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      [
        Query.equal("shop_phone", shopNumber),
        Query.equal("customer_phone", customerNumber),
      ]
    );

    console.log("IS-CHAT-AVAILABLE", isChatAvailable);
    let newChatId = isChatAvailable.documents[0]?.chat_id;
    let newChat = isChatAvailable.documents[0];

    // if not create a new chat room for the customer and shop

    if (isChatAvailable.total === 0) {
      const response = await adminDatabase.createDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
        ID.unique(),
        {
          customer_phone: customerNumber,
          customer_name,
          chat_id: ID.unique(),
          shop_phone: shopNumber,
          unseen_messages: 0,
        },
        [Permission.read(Role.any())]
      );
      newChat = response;
      newChatId = response?.chat_id;
    }

    // fetch the shop details

    const shopResponse = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      [Query.equal("shop_number", shopNumber)]
    );

    // creating message with the message sent by the customer

    const message = await adminDatabase.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      messageSid,
      {
        sender_type: "customer",
        content: content,
        messageId: ID.unique(),
        Receiver_id: shopResponse?.documents[0]?.shop,
        chat_id: newChatId,
        replied_msg: repliedMessage,
        customer_number: customerNumber,
        shop_phone: shopNumber,
        shop_id: shopResponse?.documents[0]?.$id,
      },
      [Permission.read(Role.any())]
    );

    // adding one to the unseen messages

    console.log("NEW-CHAT", newChat);
    await adminDatabase.updateDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      newChat?.$id,
      {
        unseen_messages: newChat?.unseen_messages + 1,
      }
    );

    // calculating the amount of token available

    const tokenAvailable =
      shopResponse?.documents[0].tokensFunded -
      shopResponse?.documents[0].tokensUsed;
    console.log(tokenAvailable);

    // checking if the chat has ai active and also checking if the token available is bellow 10000

    if (newChat?.isAIActive === true && tokenAvailable < 10000) {
      const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!}/api/agent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_type: "shop",
            content: content,
            messageId: ID.unique(),
            Receiver_id: message.Receiver_id,
            chat_id: message.chat_id,
            customer_number: customerNumber,
            shop_phone: shopNumber,
            shop_id: message?.shop_id,
          }),
        }
      );

      // returning the response from the ai agent serverless function

      return response;
    } else {
      return new NextResponse("Success", {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
    const response = await TwillioClient.messages.create({
      body: "Try again in a few minutes, Thank you",
      from: shopNumber,
      to: customerNumber,
    });
    return new NextResponse("Internal Server Error" + response.body, {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
};
