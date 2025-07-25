import { graph } from "@/agent/model";
import { Command } from "@langchain/langgraph";
import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
// import { createClient } from "@/app/lib/node-appwrite";

export const POST = async (req: NextRequest) => {
  const { adminDatabase } = CreateAdminClient();
  console.log("---CALLING-AGENT---");
  const message = await req.json();
  console.log(message);

  const threadConfig = { configurable: { thread_id: message?.chat_id } };
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

  await adminDatabase.createDocument(
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
    ID.unique(),
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
};
