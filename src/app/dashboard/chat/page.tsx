"use client";

// import { getChats, getMessages } from "@/helpers/shopifyQuery";
// import { fetchCustomerCount } from "@/helpers/shopifyQuery";
// import { clientDatabase } from "@/app/lib/client-appwrite";
// import { ID } from "appwrite";
// import { Models } from "appwrite";
// import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import ChatListSection from "@/components/ChatListSection";
// import ChatHeader from "@/components/ChatHeader";
// import MessageContainer from "@/components/MessageContainer";
// import AnalyticCard from "@/components/AnalyticsCard";

export interface Message {
  sender_type: string;
  messageId: string;
  shop_phone: string;
}

const Page = () => {
  return <ChatListSection />;
};

export default Page;
