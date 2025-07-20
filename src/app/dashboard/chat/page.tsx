"use client";

// import { getChats, getMessages } from "@/helpers/shopifyQuery";
// import { fetchCustomerCount } from "@/helpers/shopifyQuery";
// import { clientDatabase } from "@/app/lib/client-appwrite";
// import { ID } from "appwrite";
// import { Models } from "appwrite";
// import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import ChatListSection from "@/components/ChatListSection";
// import ChatHeader from "@/components/ChatHeader";
// import MessageContainer from "@/components/MessageContainer";
// import AnalyticCard from "@/components/AnalyticsCard";

const avatar = createAvatar(lorelei, {
  seed: "John Doe",
  // hair: ["variant01", "variant02", "variant03"],
  // ... other options
});

const svg = avatar.toDataUri();

export interface Message {
  sender_type: string;
  messageId: string;
  shop_phone: string;
}

const Page = () => {
  return <ChatListSection svg={svg} />;
};

export default Page;

{
  /* container for chat section  */
}
{
  /* <MessageContainer
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
    /> */
}
{
  /* </div> */
}
{
  /* </div> */
}
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
