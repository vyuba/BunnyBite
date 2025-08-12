import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import { ID, Models, Query } from "appwrite";
import { clientDatabase } from "./app/lib/client-appwrite";
import { sendTwillioMessage } from "./utils";
import { Chats } from "./types";

const getProfileIcon = (name: string, scale = 80, package_type = initials) => {
  const avatar = createAvatar(package_type, {
    seed: name,
    scale,
    backgroundColor: ["#303030"],
  });

  const svg = avatar.toDataUri();
  //   console.log(svg);
  return svg;
};

const sendMessage = async (
  content: string,
  messages: Models.DocumentList<Models.Document>,
  shop: Models.Document
) => {
  const twillioMessage = {
    content,
    shop_phone: shop?.shop_number,
    customer_number: messages.documents.find(
      (message) => message?.customer_number !== null
    )?.customer_number,
  };

  const id = await sendTwillioMessage(twillioMessage);

  try {
    const response = await clientDatabase.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
      id,
      {
        sender_type: "shop",
        content: content,
        messageId: ID.unique(),
        Receiver_id: messages.documents.find((message) => message?.Receiver_id)
          ?.Receiver_id,
        chat_id: messages.documents.find((message) => message?.chat_id !== null)
          ?.chat_id,
        customer_number: messages.documents.find(
          (message) => message?.customer_number !== null
        )?.customer_number,
        shop_phone: shop?.shop_number,
        shop_id: shop?.$id,
      }
    );
    console.log("--MESAGE-SENT--", response);
  } catch (error) {
    console.log(error);
  }
};

const changeAiToggle = async (Id: string, value: boolean) => {
  try {
    const response = await clientDatabase.updateDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      Id,
      {
        isAIActive: value,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (
  chat_id: string,
  shop_number: string,
  setMessages: React.Dispatch<
    React.SetStateAction<Models.DocumentList<Models.Document> | null>
  >
) => {
  // console.log(chat_id, shop_number);

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
        Query.orderAsc("$createdAt"),
        Query.limit(100),
      ]
    );
    setMessages(document);
    // console.log(document);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getChats = async (
  shopNumber: string
): Promise<Chats[] | null | Models.DocumentList<Models.Document>> => {
  try {
    const document = await clientDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      [Query.equal("shop_phone", shopNumber), Query.orderDesc("$updatedAt")]
    );
    if (document.total === 0) {
      return document as Models.DocumentList<Models.Document>;
    }

    const chatsWithMessages = await Promise.all(
      document.documents.map(async (doc) => {
        const messageDocument = await clientDatabase.listDocuments(
          process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
          [
            Query.equal("chat_id", doc?.chat_id || ""),
            Query.equal("shop_phone", shopNumber || ""),
            Query.orderDesc("$updatedAt"),
            Query.limit(1),
          ]
        );

        return {
          ...doc,
          messages: messageDocument.documents as Models.Document[],
        } as Chats;
      })
    );
    return chatsWithMessages;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateChatUnseen = async (id: string) => {
  await clientDatabase.updateDocument(
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
    id,
    {
      unseen_messages: 0,
    }
  );
};

const convertTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

export {
  getProfileIcon,
  sendMessage,
  changeAiToggle,
  getMessages,
  getChats,
  convertTimestamp,
  updateChatUnseen,
};
