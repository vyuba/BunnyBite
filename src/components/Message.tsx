import { useEffect, useState } from "react";
import { clientDatabase } from "@/app/lib/client-appwrite";

interface Message {
  messageId: string;
  senderType: string;
  repliedId: string | null;
  content: string;
}

const getMessage = async (id: string) => {
  if (!id) return null;
  try {
    const document = await clientDatabase.getDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      id
    );
    return document.content;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Message = ({ messageId, senderType, repliedId, content }: Message) => {
  const [repliedMessage, setRepliedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (repliedId) {
      getMessage(repliedId).then((content) => setRepliedMessage(content));
    }
  }, [repliedId]);

  return (
    <div
      id={messageId}
      className={`border ${
        senderType === "shop"
          ? "self-end shop bg-primary-background"
          : "self-start customer bg-tertiay-background"
      } border-border py-1.5  ${
        repliedId ? "rounded-lg flex flex-col gap-1 px-1" : "rounded-xl px-3"
      } w-fit max-w-[70%] h-fit`}
    >
      {repliedId && (
        <span className="tagged-reply bg-[var(--background)] border-l-3 border-border text-sm p-2 rounded-sm w-full h-fit">
          <span className="font-semibold text-black/70 dark:text-white/70">
            You
          </span>
          <p className="text-black/70 dark:text-white/70 ">
            {repliedMessage ?? "Loading..."}
          </p>
        </span>
      )}
      <p
        className={`text-sm text-black/70 dark:text-white/70 ${
          repliedId && "px-1.5"
        }`}
      >
        {content}
      </p>
    </div>
  );
};

export default Message;
