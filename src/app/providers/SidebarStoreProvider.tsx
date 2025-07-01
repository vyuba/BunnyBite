"use client";

import { Chats } from "@/types";
import { useState, createContext, useContext } from "react";

interface ChatContextType {
  isChatOpen: boolean;
  selectedChat: Chats | null;
  setIsChatOpen: (value: boolean) => void;
  setSelectedChat: (value: Chats) => void;
}
const ChatContext = createContext<ChatContextType>({
  isChatOpen: false,
  selectedChat: null,
  setIsChatOpen: () => {},
  setSelectedChat: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chats | null>(null);
  console.log("selected Chat", selectedChat);
  return (
    <ChatContext.Provider
      value={{ isChatOpen, setIsChatOpen, setSelectedChat, selectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatProvider = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
