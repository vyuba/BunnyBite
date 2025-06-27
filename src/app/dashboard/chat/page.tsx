"use client";

// import { getChats, getMessages } from "@/helpers/shopifyQuery";
// import { fetchCustomerCount } from "@/helpers/shopifyQuery";
import { Chats } from "@/types";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { useState } from "react";
import { clientDatabase } from "@/app/lib/client-appwrite";
import { ID, Query } from "appwrite";
import { Models } from "appwrite";
// import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import ChatListSection from "@/components/ChatListSection";
// import ChatHeader from "@/components/ChatHeader";
import MessageContainer from "@/components/MessageContainer";
// import AnalyticCard from "@/components/AnalyticsCard";

const avatar = createAvatar(lorelei, {
  seed: "John Doe",
  // hair: ["variant01", "variant02", "variant03"],
  // ... other options
});

const svg = avatar.toDataUri();

const getMessages = async (chat_id: string, shop_number: string) => {
  if (!chat_id || !shop_number) {
    return [];
  }
  console.log(chat_id);
  try {
    const document = await clientDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      [
        Query.equal("chat_id", chat_id),
        Query.equal("shop_phone", shop_number),
        Query.orderAsc("$updatedAt"),
        Query.limit(100),
      ]
    );

    console.log(document);
    return document;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export interface Message {
  sender_type: string;
  messageId: string;
  shop_phone: string;
  Receiver_id: string | undefined;
  chat_id: string;
  toggleAI: boolean;
}

const Page = () => {
  const { shop } = useCounterStore((state) => state);
  const [selectedChat, setSelectedChat] = useState<Chats | null>(null);
  // const [customerCount, setCustomerCount] = useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] =
    useState<Models.DocumentList<Models.Document> | null>(null);
  const [message, setMessage] = useState<Message | null>({
    sender_type: "shop",
    messageId: ID.unique(),
    shop_phone: shop?.shop_number || "",
    Receiver_id: selectedChat?.customer_name,
    chat_id: selectedChat?.chat_id || "",
    toggleAI: selectedChat?.isAIActive || false,
  });

  console.log(message, selectedChat);
  const sendMessage = async (content) => {
    try {
      // const response = fetch("/api/send-message", {
      //   method: "POST",
      //   body: JSON.stringify(message),
      // });
      const response = await clientDatabase.createDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
        ID.unique(),
        {
          sender_type: message.sender_type,
          content: content,
          messageId: message.messageId,
          Receiver_id: message.Receiver_id,
          chat_id: message.chat_id,
          shop_phone: message.shop_phone,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(customerCount);
  // console.log(chats);
  // console.log("message", message?.content);

  return (
    <div className="flex flex-col md:z-0 w-full h-full gap-2 pb-15">
      {/* chat analytics data section  */}
      {/* <div className="w-full flex flex-wrap gap-1.5 items-center">
        <AnalyticCard title={"No Of Customers"} count={customerCount} />
      </div> */}
      <div className="w-full relative md:z-0 overflow-hidden h-[calc(100dvh-135px)] flex gap-2">
        {/* container for chat list  */}
        <ChatListSection
          setMessages={setMessages}
          setMessage={setMessage}
          getMessages={getMessages}
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
          svg={svg}
          shop={shop?.shop_number || ""}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />
        {/* container for chat section  */}
        <MessageContainer
          isChatOpen={isChatOpen}
          message={message}
          messages={messages}
          selectedChat={selectedChat}
          setIsChatOpen={setIsChatOpen}
          setMessage={setMessage}
          setMessages={setMessages}
          sendMessage={sendMessage}
          shop={shop}
          svg={svg}
        />
      </div>
    </div>
  );
};

export default Page;

{
  /* not empty chat  */
}
{
  /* <div className="bg-white border self-end border-[#E3E3E3] py-1.5 px-3 rounded-lg w-fit max-w-[300px] h-fit">
<p className="text-sm text-black/70">Welcome to unruly store, can you provide the order id, so i can send the tracking link to you </p>
</div> */
}
{
  /* message box of replied messages  */
}
{
  /* <div className="bg-white flex flex-col gap-1 border self-start border-[#E3E3E3] py-1.5 px-1 rounded-lg w-fit max-w-[300px] h-fit">
<span className="tagged-reply bg-[var(--background)] border-l-3 text-sm border-#4A4A4A] p-2 rounded-sm w-full h-fit">
  <span className="font-semibold">You</span>
  <p className="text-black/70">
    Welcome to unruly store, can you provide the order id, so i can send the tracking link to you
  </p>
</span>
<p className="text-sm text-black/90 px-1">Thank you, This is my order id: 123423423890</p>
</div>
<div className="bg-white border self-end border-[#E3E3E3] py-1.5 px-3 rounded-lg w-fit max-w-[300px] h-fit">
<p className="text-sm text-black/70">Give me a couple minutes while i generate a link for you </p>
</div> */
}
