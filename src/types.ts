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

export type Shop = Models.Document & {
  isAIActive: boolean;
  products_vectors_added: boolean;
  shop: string;
  shop_number: string;
  tokensFunded: number;
  tokensUsed: number;
  twillio_account_siid: string;
  twillio_auth_token: string;
  user: string;
  personality: string;
};

export type Type = "create" | "edit" | "delete";
