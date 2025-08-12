import { useEffect, useState } from "react";
import { clientDatabase } from "@/app/lib/client-appwrite";
import { type Message } from "@/types";
import { CheckIcon } from "@phosphor-icons/react";
import { convertTimestamp } from "@/client-utils";

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

const Message = ({
  messageId,
  senderType,
  repliedId,
  content,
  sending,
  createdAt,
}: Message) => {
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
      <div
        className={`text-sm text-black/70 dark:text-white/70 flex items-end-safe gap-1.5 ${
          repliedId && "px-1.5"
        }`}
      >
        <p>{content}</p>
        <div className="h-2.5 text-[12px] text-black/50 dark:text-white/50 text-nowrap relative gap-0.5 flex items-center uppercase">
          {convertTimestamp(createdAt)}
          {senderType === "shop" && sending ? (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.50009 0.877014C3.84241 0.877014 0.877258 3.84216 0.877258 7.49984C0.877258 11.1575 3.8424 14.1227 7.50009 14.1227C11.1578 14.1227 14.1229 11.1575 14.1229 7.49984C14.1229 3.84216 11.1577 0.877014 7.50009 0.877014ZM1.82726 7.49984C1.82726 4.36683 4.36708 1.82701 7.50009 1.82701C10.6331 1.82701 13.1729 4.36683 13.1729 7.49984C13.1729 10.6328 10.6331 13.1727 7.50009 13.1727C4.36708 13.1727 1.82726 10.6328 1.82726 7.49984ZM8 4.50001C8 4.22387 7.77614 4.00001 7.5 4.00001C7.22386 4.00001 7 4.22387 7 4.50001V7.50001C7 7.63262 7.05268 7.7598 7.14645 7.85357L9.14645 9.85357C9.34171 10.0488 9.65829 10.0488 9.85355 9.85357C10.0488 9.65831 10.0488 9.34172 9.85355 9.14646L8 7.29291V4.50001Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <CheckIcon />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
