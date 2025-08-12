import { Models } from "node-appwrite";
export interface Chats extends Models.Document {
  shop_phone: string;
  customer_name: string;
  customer_phone: string;
  unseen_messages: number;
  chat_id: string;
  messages: Models.Document[]; // or just an array of message type
}

export interface Message {
  messageId: string;
  senderType: string;
  repliedId: string | null;
  content: string;
  sending?: boolean;
  createdAt: string;
}
