import { graph } from "@/agent/model";
import { Command } from "@langchain/langgraph";
import { NextRequest, NextResponse } from "next/server";
import { Permission, Role } from "node-appwrite";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
import { sendTwillioMessage } from "@/utils";

export const POST = async (req: NextRequest) => {
  const { adminDatabase } = CreateAdminClient();
  console.log("---CALLING-AGENT---");
  const message = await req.json();
  console.log(message);

  try {
    const threadConfig = {
      configurable: { thread_id: message.chat_id, shop_id: message.shop_id },
    };
    const GraphResponse = await graph.invoke(
      {
        action: "update",
        messages: [],
      },
      threadConfig
    );

    const response = await graph.invoke(
      new Command({
        resume: {
          user_input: message?.content,
          messages: GraphResponse.messages,
        },
      }),
      threadConfig
    );

    const twillioMessage = {
      content: response?.output,
      shop_phone: message?.shop_phone,
      customer_number: message?.customer_number,
      twillio_account_siid: message.twillio_account_siid,
      twillio_auth_token: message.twillio_auth_token,
    };

    const id = await sendTwillioMessage(twillioMessage);

    await adminDatabase.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      id,
      {
        sender_type: message?.sender_type,
        content: response?.output,
        messageId: message?.messageId,
        Receiver_id: message?.Receiver_id,
        chat_id: message?.chat_id,
        customer_number: message?.customer_number,
        shop_phone: message?.shop_phone,
        shop_id: message?.shop_id,
      },
      [Permission.read(Role.any())]
    );

    // console.log(response);
    return NextResponse.json({ message: "Post recieved" }, { status: 200 });
  } catch (error) {
    const twillioMessage = {
      content: "Try again in one minute, Thank you",
      shop_phone: message?.shop_phone,
      customer_number: message?.customer_number,
      twillio_account_siid: message.twillio_account_siid,
      twillio_auth_token: message.twillio_auth_token,
    };

    const id = await sendTwillioMessage(twillioMessage);

    await adminDatabase.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      id,
      {
        sender_type: message?.sender_type,
        content: twillioMessage?.content,
        messageId: message?.messageId,
        Receiver_id: message?.Receiver_id,
        chat_id: message?.chat_id,
        customer_number: message?.customer_number,
        shop_phone: message?.shop_phone,
        shop_id: message?.shop_id,
      },
      [Permission.read(Role.any())]
    );
    console.log(error);
    return NextResponse.json(
      { message: "Error" },
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }
};
