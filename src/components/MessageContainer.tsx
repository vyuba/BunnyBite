"use client";

import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import ChatHeader from "./ChatHeader";
import { useEffect, useRef, useState } from "react";
import { client, clientDatabase } from "@/app/lib/client-appwrite";
import { Models } from "node-appwrite";
import { ID, Query } from "appwrite";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { useChatProvider } from "@/app/providers/SidebarStoreProvider";
// import { ID } from "appwrite";

// const sendAIMessage = async (message, payload) => {
//   console.log(message);
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!}/api/agent`,
//     {
//       method: "POST",
//       // headers: {
//       //   "Content-Type": "application/json",
//       // },
//       body: JSON.stringify({
//         sender_type: message.sender_type,
//         content: payload?.content,
//         messageId: ID.unique(),
//         shop_phone: message.shop_number,
//         Receiver_id: message.Receiver_id,
//         chat_id: message.chat_id,
//       }),
//     }
//   );
//   const data = await response.json();
//   console.log(data);
// };

const getMessages = async (
  chat_id: string,
  shop_number: string,
  setMessages: React.Dispatch<
    React.SetStateAction<Models.DocumentList<Models.Document> | null>
  >
) => {
  console.log(chat_id, shop_number);

  if (!chat_id || !shop_number) {
    return [];
  }
  // console.log(chat_id);
  try {
    const document = await clientDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      [
        Query.equal("chat_id", chat_id),
        Query.equal("shop_phone", shop_number),
        Query.orderAsc("$updatedAt"),
        Query.limit(100),
      ]
    );
    setMessages(document);
    console.log(document);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const MessageContainer = ({ id }: { id: string }) => {
  const { isChatOpen, setIsChatOpen } = useChatProvider();
  const { shop } = useCounterStore((state) => state);
  const message_box = useRef<HTMLDivElement>(null);
  const bottom_message = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] =
    useState<Models.DocumentList<Models.Document> | null>(null);

  useEffect(() => {
    getMessages(id, shop?.shop_number, setMessages);

    if (bottom_message && bottom_message.current) {
      bottom_message.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID}.documents`,
      (response) => {
        const document = response.payload as Models.Document;
        const chatId = document?.chat_id;
        // const customer = document?.sender_type === "customer";
        if (
          document &&
          id === chatId &&
          response.events[0].includes("create")
        ) {
          setMessages((prev) => ({
            ...prev,
            documents: [
              ...(prev?.documents || []),
              response.payload as Models.Document,
            ],
          }));

          bottom_message.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }
    );

    if (!unsubscribe) {
      return;
    }
    return () => unsubscribe();
  }, [shop?.shop_number, id, bottom_message]);

  const sendMessage = async (content) => {
    try {
      const response = await clientDatabase.createDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
        ID.unique(),
        {
          sender_type: "shop",
          content: content,
          messageId: ID.unique(),
          Receiver_id: messages.documents.find(
            (message) => message?.Receiver_id
          )?.Receiver_id,
          chat_id: messages.documents.find((message) => message?.chat_id)
            ?.chat_id,
          customer_number: messages.documents[0]?.customer_number,
          shop_phone: shop?.shop_number,
          shop_id: shop?.$id,
        }
      );
      console.log("--MESAGE-SENT--", response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-full ${
        isChatOpen ? "translate-x-full z-10" : " translate-x-0 z-20  "
      } md:translate-x-0 md:z-0  h-full relative duration-300  bg-primary-background overflow-hidden rounded-md border border-border`}
    >
      {/* bg-repeat bg-[url('/whatsappbackground.png')] */}
      <div className="bg-primary-background w-full h-full">
        {messages && messages.total > 0 ? (
          <div className="w-full h-full flex flex-col">
            <ChatHeader />

            <div
              ref={message_box}
              className="w-full flex-1 flex flex-col gap-2 py-16 px-3 overflow-auto "
            >
              {messages?.documents.map((message) => (
                <div
                  key={message?.$id}
                  className={`bg-primary-background border   ${
                    message?.sender_type === "shop"
                      ? "self-end shop"
                      : "self-start customer"
                  } border-border py-1.5 px-3 ${
                    message?.replied_msg
                      ? "rounded-lg flex flex-col gap-1"
                      : "rounded-xl"
                  }  w-fit max-w-[70%] h-fit`}
                >
                  {message?.replied_msg && (
                    <span className="tagged-reply bg-[var(--background)] border-l-3 text-sm border-#4A4A4A] p-2 rounded-sm w-full h-fit">
                      <span className="font-semibold">You</span>
                      <p className="text-black/70 dark:text-white/70">
                        {message?.replied_msg}
                      </p>
                    </span>
                  )}
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {message?.content}
                  </p>
                </div>
              ))}
              <div ref={bottom_message} className="opacity-0 h-5" />
            </div>

            {/* Messaging input section  */}
            <div className=" w-full h-13 p-2 bg-[var(--background)] flex items-center gap-1 border-t border-border">
              <input
                value={content || ""}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-border px-3 h-full text-black/70 dark:text-white/70 outline-0 bg-primary-background rounded-full"
                type="text"
                onKeyDown={async (e) => {
                  if (e.key.toLowerCase() === "enter") {
                    e.preventDefault();
                    if (content.trim() === "") return;
                    await sendMessage(content);
                    setContent("");
                  }
                }}
              />
              <button
                className={` ${
                  content === "" ? "cursor-not-allowed" : "cursor-pointer"
                } `}
                disabled={content === "" ? true : false}
                onClick={async () => {
                  if (content === "") {
                    return;
                  }

                  await sendMessage(content);
                  setContent("");
                }}
              >
                <PaperPlaneRightIcon fill="var(--icon-background)" size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* empty chat section  */}
            <div className="flex flex-col items-center">
              <svg
                width="170"
                height="200"
                viewBox="0 0 214 219"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <rect
                  x="1.07892"
                  y="34.7554"
                  width="115.661"
                  height="115.661"
                  rx="15.0729"
                  transform="rotate(-11.9342 1.07892 34.7554)"
                  className="fill-[var(--background)] "
                ></rect>
                <rect
                  x="1.07892"
                  y="34.7554"
                  width="115.661"
                  height="115.661"
                  rx="15.0729"
                  transform="rotate(-11.9342 1.07892 34.7554)"
                  className="stroke-border"
                ></rect>
                <rect
                  x="60.125"
                  y="12.5767"
                  width="115.661"
                  height="115.661"
                  rx="15.0729"
                  className="fill-[var(--background)] "
                ></rect>
                <rect
                  x="60.125"
                  y="12.5767"
                  width="115.661"
                  height="115.661"
                  rx="15.0729"
                  className="stroke-border"
                ></rect>
                <rect
                  x="97.4868"
                  y="1.00107"
                  width="115.661"
                  height="115.661"
                  rx="15.0729"
                  transform="rotate(3 97.4868 1.00107)"
                  className="fill-[var(--background)] "
                ></rect>
                <rect
                  x="97.4868"
                  y="1.00107"
                  width="115.661"
                  height="115.661"
                  rx="15.0729"
                  transform="rotate(3 97.4868 1.00107)"
                  className="stroke-border"
                ></rect>
                <g clipPath="url(#clip0_0_21173)">
                  <path
                    d="M152.49 156.654L146.14 195.294L145.87 196.924C145.87 196.924 145.87 196.854 145.86 196.824C145.83 197.104 145.8 197.384 145.75 197.664C144.93 202.854 141.21 207.354 134.6 211.164C129.4 214.164 123.48 216.124 116.82 217.064H116.78C113.72 217.504 110.5 217.714 107.13 217.704C103.67 217.694 100.37 217.464 97.2398 217.004C90.6398 216.034 84.7498 214.054 79.5798 211.064C73.0098 207.274 69.2598 202.824 68.3198 197.714L68.1798 196.874V196.794C68.1598 196.704 68.1498 196.614 68.1398 196.514V196.574L67.8798 194.984L61.5098 156.334C63.7398 158.484 66.4598 160.494 69.6798 162.344C74.8698 165.354 80.7398 167.604 87.2598 169.114C88.0498 169.294 88.8498 169.474 89.6298 169.624C95.3898 170.784 101.24 171.374 107.16 171.384C112.99 171.404 118.74 170.854 124.39 169.734C125.28 169.574 126.16 169.384 127.05 169.184C133.56 167.704 139.4 165.474 144.56 162.484C147.67 160.684 150.32 158.744 152.49 156.654Z"
                    className="fill-[var(--background)]  stroke-border"
                    strokeMiterlimit="10"
                  ></path>
                  <path
                    d="M156.03 114.214C153.42 110.454 149.52 107.064 144.32 104.074C139.13 101.064 133.26 98.8144 126.73 97.3044C120.21 95.7944 113.57 95.0444 106.84 95.0244C100.1 95.0244 93.47 95.7544 86.95 97.2344C80.44 98.7144 74.6 100.944 69.44 103.934C64.28 106.914 60.41 110.284 57.84 114.044C55.27 117.804 53.99 121.624 54.02 125.524C54.02 128.064 54.6 130.594 55.72 133.084C55.87 133.424 56.04 133.764 56.21 134.104C56.41 134.484 56.61 134.854 56.84 135.224C56.99 135.504 57.16 135.784 57.34 136.064C57.42 136.194 57.51 136.334 57.6 136.464C57.72 136.644 57.84 136.834 57.97 137.014C58.2 137.344 58.44 137.674 58.69 137.994C58.94 138.324 59.2 138.644 59.47 138.964C59.56 139.084 59.67 139.204 59.78 139.324C59.95 139.524 60.13 139.724 60.31 139.914C60.52 140.144 60.73 140.364 60.95 140.594C61.25 140.904 61.57 141.204 61.89 141.504C62.2 141.794 62.51 142.084 62.84 142.364C63.1 142.594 63.37 142.814 63.64 143.034C63.88 143.234 64.13 143.434 64.38 143.624C64.64 143.834 64.9 144.024 65.17 144.224C65.72 144.634 66.3 145.044 66.89 145.434C67.12 145.594 67.35 145.744 67.59 145.894C68.26 146.324 68.96 146.744 69.68 147.164C74.87 150.164 80.74 152.414 87.26 153.924C88.05 154.114 88.85 154.284 89.63 154.444C95.39 155.604 101.24 156.194 107.16 156.204C112.99 156.214 118.74 155.664 124.39 154.554C125.28 154.384 126.16 154.194 127.05 153.994C133.56 152.514 139.4 150.284 144.56 147.304C145.46 146.784 146.33 146.244 147.15 145.694C147.39 145.544 147.62 145.384 147.85 145.224C148.2 144.984 148.53 144.754 148.86 144.504C149.19 144.264 149.51 144.024 149.82 143.784C150.14 143.534 150.45 143.284 150.75 143.024C150.89 142.914 151.03 142.794 151.17 142.664C151.31 142.554 151.45 142.434 151.58 142.304C151.86 142.064 152.13 141.814 152.4 141.554C152.59 141.384 152.78 141.194 152.96 141.004C153.5 140.474 154 139.934 154.47 139.384C154.59 139.254 154.7 139.114 154.8 138.984C155.29 138.394 155.74 137.794 156.16 137.184C156.4 136.834 156.63 136.474 156.85 136.114C157.05 135.794 157.24 135.474 157.42 135.144C157.55 134.924 157.67 134.694 157.79 134.464C157.96 134.124 158.12 133.794 158.27 133.454C159.41 130.934 159.98 128.374 159.98 125.794V125.714C159.95 121.814 158.64 117.994 156.03 114.214ZM152.75 125.694C152.75 126.764 152.66 127.814 152.48 128.844C152.07 131.054 151.21 133.154 149.9 135.154C149.64 135.544 149.37 135.924 149.08 136.304C147.91 137.844 146.45 139.324 144.72 140.734C143.18 141.994 141.41 143.184 139.43 144.344C136.34 146.134 133.03 147.604 129.49 148.764C122.83 150.954 115.38 152.044 107.13 152.024C98.81 152.024 91.27 150.874 84.52 148.594C81.06 147.444 77.81 145.984 74.76 144.224C72.7 143.024 70.87 141.784 69.28 140.464C67.55 139.044 66.1 137.564 64.93 136.014C64.63 135.634 64.36 135.244 64.1 134.844C62.79 132.844 61.93 130.724 61.53 128.504C61.35 127.524 61.26 126.534 61.25 125.524V125.304C61.3 118.114 65.74 111.994 74.57 106.894C75.36 106.424 76.17 105.994 76.99 105.584C85.41 101.304 95.38 99.1744 106.85 99.2044C118.43 99.2244 128.47 101.424 136.98 105.794C137.74 106.174 138.49 106.594 139.22 107.014C148.18 112.184 152.68 118.384 152.75 125.644V125.694Z"
                    className="fill-[var(--background)]  stroke-border"
                    strokeMiterlimit="10"
                  ></path>
                  <path
                    d="M152.75 125.644V125.694C152.75 126.764 152.66 127.814 152.48 128.844C152.07 131.054 151.21 133.154 149.9 135.154C149.64 135.544 149.37 135.924 149.08 136.304C146.83 133.154 143.52 130.304 139.15 127.784C134.67 125.194 129.62 123.254 124 121.954C118.38 120.664 112.66 120.004 106.86 119.994C101.06 119.984 95.35 120.614 89.74 121.894C84.13 123.174 79.1 125.094 74.66 127.664C70.38 130.134 67.13 132.914 64.93 136.014C64.63 135.634 64.36 135.244 64.1 134.844C62.79 132.844 61.93 130.724 61.53 128.504C61.35 127.524 61.26 126.534 61.25 125.524V125.304C61.3 118.114 65.74 111.994 74.57 106.894C75.36 106.424 76.17 105.994 76.99 105.584C85.41 101.304 95.38 99.1744 106.85 99.2044C118.43 99.2244 128.47 101.424 136.98 105.794C137.74 106.174 138.49 106.594 139.22 107.014C148.18 112.184 152.68 118.384 152.75 125.644Z"
                    className="fill-[var(--background)]  stroke-border"
                    strokeMiterlimit="10"
                  ></path>
                  <path
                    d="M149.08 136.304C147.91 137.844 146.45 139.324 144.72 140.734C143.18 141.994 141.41 143.184 139.43 144.344C136.34 146.134 133.03 147.604 129.49 148.764C122.83 150.954 115.38 152.044 107.13 152.024C98.8097 152.024 91.2697 150.874 84.5197 148.594C81.0597 147.444 77.8097 145.984 74.7597 144.224C72.6997 143.024 70.8697 141.784 69.2797 140.464C67.5497 139.044 66.0997 137.564 64.9297 136.014C67.1297 132.914 70.3797 130.134 74.6597 127.664C79.0997 125.094 84.1297 123.174 89.7397 121.894C95.3497 120.614 101.06 119.984 106.86 119.994C112.66 120.004 118.38 120.664 124 121.954C129.62 123.254 134.67 125.194 139.15 127.784C143.52 130.304 146.83 133.154 149.08 136.304Z"
                    className="fill-[var(--background)]  stroke-border"
                    strokeMiterlimit="10"
                  ></path>
                  <path
                    d="M159.98 125.794V141.084C159.98 144.014 159.25 146.904 157.79 149.764C157.32 150.674 156.77 151.584 156.16 152.484C155.14 153.974 153.92 155.404 152.49 156.764C150.32 158.854 147.67 160.794 144.56 162.594C139.4 165.584 133.56 167.814 127.05 169.294C126.16 169.494 125.28 169.684 124.39 169.844C118.74 170.964 112.99 171.514 107.16 171.494C101.24 171.484 95.3895 170.894 89.6295 169.734C88.8495 169.584 88.0495 169.404 87.2595 169.224C80.7395 167.714 74.8695 165.464 69.6795 162.454C66.4595 160.604 63.7395 158.594 61.5095 156.444C60.1395 155.124 58.9595 153.744 57.9695 152.314C57.2995 151.344 56.7195 150.374 56.2095 149.404C54.7695 146.574 54.0295 143.714 54.0195 140.814V125.524C54.0195 128.064 54.5995 130.594 55.7195 133.084C55.8695 133.424 56.0395 133.764 56.2095 134.104C56.4095 134.484 56.6095 134.854 56.8395 135.224C56.9895 135.504 57.1595 135.784 57.3395 136.064C57.4195 136.194 57.5095 136.334 57.5995 136.464C57.7195 136.644 57.8395 136.834 57.9695 137.014C58.1995 137.344 58.4395 137.674 58.6895 137.994C58.9295 138.324 59.1895 138.644 59.4695 138.964C59.5595 139.084 59.6695 139.204 59.7795 139.324C59.9495 139.524 60.1295 139.724 60.3095 139.914C60.5095 140.144 60.7295 140.364 60.9495 140.594C61.2495 140.904 61.5695 141.204 61.8895 141.504C62.1995 141.794 62.5095 142.084 62.8395 142.364C63.0995 142.594 63.3695 142.814 63.6395 143.034C63.8795 143.234 64.1295 143.434 64.3795 143.624C64.6395 143.834 64.8995 144.024 65.1695 144.224C65.7195 144.634 66.2995 145.044 66.8895 145.434C67.1195 145.594 67.3495 145.744 67.5895 145.894C68.2595 146.324 68.9595 146.744 69.6795 147.164C74.8695 150.164 80.7395 152.414 87.2595 153.924C88.0495 154.114 88.8495 154.284 89.6295 154.444C95.3895 155.604 101.24 156.194 107.16 156.204C112.99 156.204 118.74 155.664 124.39 154.554C125.28 154.384 126.16 154.194 127.05 153.994C133.56 152.514 139.4 150.284 144.56 147.304C145.46 146.784 146.33 146.244 147.15 145.694C147.39 145.544 147.62 145.384 147.85 145.224C148.2 144.984 148.53 144.754 148.86 144.504C149.19 144.264 149.51 144.024 149.82 143.784C150.14 143.534 150.45 143.284 150.75 143.024C150.89 142.914 151.03 142.794 151.17 142.664C151.31 142.554 151.45 142.434 151.58 142.304C151.86 142.064 152.13 141.814 152.4 141.554C152.59 141.384 152.78 141.194 152.96 141.004C153.5 140.474 154 139.934 154.47 139.384C154.59 139.254 154.7 139.114 154.8 138.984C155.29 138.394 155.74 137.794 156.16 137.184C156.4 136.834 156.63 136.474 156.85 136.114C157.05 135.794 157.24 135.474 157.42 135.144C157.55 134.924 157.67 134.694 157.79 134.464C157.96 134.124 158.12 133.794 158.27 133.454C159.41 130.934 159.98 128.374 159.98 125.794Z"
                    className="fill-[var(--background)]  stroke-border"
                    strokeMiterlimit="10"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_0_21173">
                    <rect
                      width="106.96"
                      height="123.68"
                      fill="white"
                      transform="translate(53.5195 94.5244)"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="border w-fit cursor-pointer border-border  text-black/70 dark:text-white/70 capitalize px-3 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg"
              >
                Select a chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
