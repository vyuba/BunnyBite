"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useChatProvider } from "@/app/providers/SidebarStoreProvider";
import ChatHeaderLoading from "./ChatHeaderLoading";

const MessageLoader = () => {
  const { isChatOpen } = useChatProvider();
  return (
    <div
      className={`w-full ${
        isChatOpen ? "translate-x-full z-10" : " translate-x-0 z-20  "
      } md:translate-x-0 md:z-0  h-full relative duration-300  bg-primary-background overflow-hidden rounded-md border border-border`}
    >
      <div className="w-full h-full flex items-center bg-primary-background justify-center overflow-hidden rounded-md">
        <div className="flex flex-col items-center gap-1">
          <ChatHeaderLoading />
          <LoadingSpinner />
          <p className="text-black/50 dark:text-white/50 text-sm">Loading..</p>
        </div>
      </div>
    </div>
  );
};

export default MessageLoader;
