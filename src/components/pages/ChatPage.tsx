"use client";
import { ChatProvider } from "@/app/providers/SidebarStoreProvider";

const ChatPage = ({ children }: { children: React.ReactNode }) => {
  return <ChatProvider>{children}</ChatProvider>;
};

export default ChatPage;
