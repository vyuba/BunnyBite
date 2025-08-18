"use server";
import { cookies } from "next/headers";
import { Models } from "node-appwrite";
import { createClient } from "./app/lib/node-appwrite";
import { api } from "./polar";
import { TwillioClient } from "./app/lib/twillio";

const setJwtCookie = async (key: Models.Jwt) => {
  (await cookies()).set("jwt", key?.jwt, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  });

  const { appwriteClient } = await createClient();
  appwriteClient.headers["X-Appwrite-JWT"] = key?.jwt;
};

const getShopDetails = async (id: string) => {
  const { databases } = await createClient();
  const response = await databases.getDocument(
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
    id
  );

  return response;
};

const setCurrentShopCookie = async (shop: string) => {
  const cookieStore = await cookies();
  cookieStore.set("shop", shop);
};

const sendTwillioMessage = async (message) => {
  try {
    const response = await TwillioClient.messages.create({
      body: message.content,
      from: message.shop_phone,
      to: message.customer_number,
    });

    return response.sid;
  } catch (error) {
    console.log(error);
  }
};

async function run(userid) {
  const checkout = await api.checkouts.create({
    products: [process.env.POLAR_PRODUCT_ID],
    externalCustomerId: userid,
  });

  console.log(checkout.url);
}

export {
  setJwtCookie,
  getShopDetails,
  run,
  sendTwillioMessage,
  setCurrentShopCookie,
};
