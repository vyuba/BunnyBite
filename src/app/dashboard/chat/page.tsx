"use client";
import ChatListSection from "@/components/ChatListSection";
import MessageContainer from "@/components/MessageContainer";
import { Suspense } from "react";

export interface Message {
  sender_type: string;
  messageId: string;
  shop_phone: string;
}

const Page = () => {
  return (
    <div className="w-full relative md:z-0 overflow-hidden h-[calc(100dvh-135px)] flex gap-2">
      <ChatListSection />
      <Suspense fallback={<MessageContainer />}>
        <MessageContainer />
      </Suspense>
    </div>
  );
};

export default Page;
