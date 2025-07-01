"use client";

import ChatListSection from "@/components/ChatListSection";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

const MessageDefaultSlot = () => {
  const avatar = createAvatar(lorelei, {
    seed: "John Doe",
    // hair: ["variant01", "variant02", "variant03"],
    // ... other options
  });

  const svg = avatar.toDataUri();

  return <ChatListSection svg={svg} />;
};

export default MessageDefaultSlot;
