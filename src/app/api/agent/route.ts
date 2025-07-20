import { graph } from "@/app/agent/model";
import { createClient } from "@/app/lib/node-appwrite";
import { Command } from "@langchain/langgraph";
import { NextRequest, NextResponse } from "next/server";
import { ID, Permission, Role } from "node-appwrite";

export const POST = async (req: NextRequest) => {
  const { databases } = await createClient();
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

  await databases.createDocument(
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
    },
    [
      Permission.read(Role.user("684e2a400021d564a828")),
      Permission.write(Role.user("684e2a400021d564a828")),
      Permission.update(Role.user("684e2a400021d564a828")),
    ]
  );
  console.log(response);
  return NextResponse.json({ message: "Post recieved" }, { status: 200 });
};
