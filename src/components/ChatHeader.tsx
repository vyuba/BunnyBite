import { useChatProvider } from "@/app/providers/SidebarStoreProvider";
import { changeAiToggle, getProfileIcon } from "@/client-utils";
import { Chats } from "@/types";
import { lorelei } from "@dicebear/collection";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useTransition, useOptimistic, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clientDatabase } from "@/app/lib/client-appwrite";

const ChatHeader = () => {
  const { selectedChat, setIsChatOpen, setSelectedChat } = useChatProvider();
  // Optimistic state for AI toggle
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [optimisticAIActive, toggleOptimisticAI] = useOptimistic(
    selectedChat?.isAIActive,
    (_currentState, newValue: boolean) => newValue
  );

  useEffect(() => {
    const getChat = async () => {
      if (!selectedChat) {
        const chat = await clientDatabase.getDocument(
          process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
          id!
        );
        setSelectedChat(chat as Chats);
        console.log("chat", chat);
      }
      return null;
    };
    getChat();
  }, [id, setSelectedChat, selectedChat]);

  const handleToggle = async () => {
    startTransition(async () => {
      toggleOptimisticAI(!optimisticAIActive);
      try {
        const response = await changeAiToggle(
          selectedChat?.$id,
          !optimisticAIActive
        );
        setSelectedChat(response as Chats);
      } catch (error) {
        toggleOptimisticAI(optimisticAIActive);
        console.error("Failed to update AI toggle:", error);
      }
    });
  };
  return (
    <div className="absolute top-0 z-10 left-0 w-full h-13 bg-[var(--background)] border-b border-border flex items-center justify-between px-2 overflow-hidden">
      {/* profile icon and name container */}
      <div className="w-fit h-full flex items-center gap-2">
        <ArrowLeftIcon
          onClick={() => setIsChatOpen(true)}
          size={16}
          weight="bold"
          className="p-2 md:hidden text-black/70 dark:text-white/70 hover:bg-white rounded-md cursor-pointer size-fit "
        />
        <Image
          src={getProfileIcon(selectedChat?.customer_name, 100, lorelei)}
          alt={selectedChat?.customer_name || "profile picture"}
          width={30}
          height={30}
          className="bg-tertiay-background block border-border border rounded-full size-10"
        />
        <p className="text-sm  text-black/70 dark:text-white/70 capitalize font-medium">
          {selectedChat?.customer_name}
        </p>
      </div>
      <div className="flex w-fit h-full justify-center items-center gap-1 relative">
        <div className="size-5 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#00BFAE"
          >
            <path d="M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325 10.6673 9.33325ZM11.4173 11.9999 9.18905 10.8115 8.00065 8.58325 6.81224 10.8115 4.58398 11.9999 6.81224 13.1883 8.00065 15.4166 9.18905 13.1883 11.4173 11.9999ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z"></path>
          </svg>
        </div>

        <label className="switch cursor-pointer">
          <input
            type="checkbox"
            checked={optimisticAIActive || false}
            onChange={async () => {
              await handleToggle();
            }}
            disabled={isPending}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};
export default ChatHeader;
