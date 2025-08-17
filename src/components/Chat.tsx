import Image from "next/image";
import HighlightedText from "./HighlightedText";
import {
  convertTimestamp,
  getProfileIcon,
  updateChatUnseen,
} from "@/client-utils";
// import Link from "next/link";
import { useCallback } from "react";
import { useChatProvider } from "@/app/providers/SidebarStoreProvider";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { lorelei } from "@dicebear/collection";
import { Chats } from "@/types";

const Chat = ({ chat, query }: { chat: Chats | null; query: string }) => {
  const { setIsChatOpen, setSelectedChat } = useChatProvider();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value);
      });
      return params.toString();
    },
    [searchParams]
  );

  const updateUnseen = async (chat: Chats) => {
    if (chat?.unseen_messages > 0) {
      await updateChatUnseen(chat.$id);
      setSelectedChat({
        ...chat,
        unseen_messages: 0,
      });
    }
  };

  return (
    <div
      onClick={async () => {
        setIsChatOpen(false);
        setSelectedChat(chat);
        updateUnseen(chat);
        router.push(
          `${pathname}?${createQueryString({
            chat_id: chat?.chat_id,
            id: chat?.$id,
          })}`
        );
      }}
      data-chat-id={chat.$id}
      className={`
      ${
        // selectedChat?.$id === chat.$id ||
        searchParams.get("id") === chat.$id ? "bg-tertiay-background" : ""
      }
              flex items-center gap-2 cursor-pointer  hover:bg-tertiay-background rounded-sm transition-all  pl-2 py-3 `}
      key={chat.$id}
    >
      <Image
        src={getProfileIcon(chat?.customer_name, 100, lorelei)}
        alt={chat?.customer_name || "customer"}
        width={30}
        height={30}
        className="bg-white dark:bg-black/40 block border-border border rounded-full size-10"
      />
      <div className="flex flex-col gap-1.5 overflow-hidden w-full relative">
        <h1 className={`text-sm capitalize font-medium `}>
          <HighlightedText text={chat?.customer_name} query={query} />
        </h1>
        <span className="text-xs md:text-sm truncate max-w-[90%]">
          {chat?.messages[0]?.content}
        </span>
        <span className="text-xs text-right absolute text-black/50 dark:text-white/50 top-0 right-0 pr-2 flex flex-col gap-1.5 items-end">
          <p>{convertTimestamp(chat?.messages[0]?.$createdAt)}</p>
          {chat?.unseen_messages > 0 && (
            <span className="rounded-full border border-border dark:text-white/50 text-black/50 text-xs md:text-sm bg-tertiay-background px-1.5 w-fit">
              {chat?.unseen_messages}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Chat;
