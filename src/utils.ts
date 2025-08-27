"use server";
import { cookies } from "next/headers";
import { Models, Query } from "node-appwrite";
import { CreateAdminClient, createClient } from "./app/lib/node-appwrite";
import { api } from "./polar";
import { getShopify } from "./app/lib/shopify";
import { model } from "./app/lib/openai";
import { pcIndex } from "./app/lib/pinecone";
import { initTwilio } from "./app/lib/twillio";

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
  const twilioClient = await initTwilio(
    message.twillio_account_siid,
    message.twillio_auth_token
  );

  try {
    const response = await twilioClient.messages.create({
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

const appUninstallHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  const { shopify, appwritesessionStorage } = await getShopify();
  const { adminDatabase } = CreateAdminClient();
  const sessionId = shopify.session.getOfflineId(shop);
  const webhookBody = JSON.parse(webhookRequestBody);
  console.log("webhook body", webhookBody);
  console.log("webhook id", webhookId);
  console.log("api version", apiVersion);
  console.log("topic", topic);

  try {
    // fetching the shop id
    const userShop = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      [Query.equal("shop", shop)]
    );

    await appwritesessionStorage.deleteSession(sessionId);

    // if there is no shop number that means there can't be any messages or chat so i am checking for that

    if (userShop.documents[0].shop_number) {
      //checking for message response
      const messageResponse = await adminDatabase.listDocuments(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
        [Query.equal("shop_phone", userShop.documents[0].shop_number)]
      );

      //if there is not messages then no need to delete cause there is none

      if (messageResponse.total > 0) {
        await adminDatabase.deleteDocuments(
          process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID!,
          [Query.equal("shop_phone", userShop.documents[0].shop_number)]
        );
      }

      // checking if there is any chat

      const chatsResponse = await adminDatabase.listDocuments(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
        [Query.equal("shop_phone", userShop.documents[0].shop_number)]
      );

      // only deleting if there is chat available

      if (chatsResponse.total > 0) {
        await adminDatabase.deleteDocuments(
          process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
          [Query.equal("shop_phone", userShop.documents[0].shop_number)]
        );
      }
    }

    // checking if there is any refund

    const refundResponse = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_REFUND_COLLECTION_ID!,
      [Query.equal("shopId", userShop.documents[0].$id)]
    );

    // only deleting if there is refund
    if (refundResponse.total > 0) {
      await adminDatabase.deleteDocuments(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_REFUND_COLLECTION_ID!,
        [Query.equal("shopId", userShop.documents[0].$id)]
      );
    }

    await adminDatabase.deleteDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      [Query.equal("shop", shop)]
    );

    const deleteResponse = await pcIndex.namespace(`__${shop}__`).deleteMany({
      shop: { $eq: shop },
    });

    await pcIndex.deleteNamespace(`__${shop}__`);

    console.log("Deleted Shop Pinecone Response", deleteResponse);
  } catch (error) {
    console.log(error);
  }
};

const customerCreateHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  // const sessionId = shopify.session.getOfflineId(shop);
  const webhookBody = JSON.parse(webhookRequestBody);
  console.log("webhook body", webhookBody);
  console.log("webhook id", webhookId);
  console.log("api version", apiVersion);
  console.log("topic", topic);
  // await sessionStorage.deleteSession(sessionId);
  // await sessionStorage.deleteSession(`offline_${shop}`)
  // await prisma.session.deleteMany({ where: { shop } });
  // await prisma.stores.upsert({
  //   where: { shop: shop },
  //   update: { isActive: false },
  //   create: { shop: shop, isActive: false },
  // });
  // Fetch the session from storage and process the webhook event
};

const productCreateHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  // const sessionId = shopify.session.getOfflineId(shop);
  const product = JSON.parse(webhookRequestBody);
  console.log("webhook body", product);
  console.log("webhook id", webhookId);
  console.log("api version", apiVersion);
  console.log("topic", topic);
  const { adminDatabase } = CreateAdminClient();

  try {
    // fetching the shop id
    const userShop = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      [Query.equal("shop", shop)]
    );

    // creating an embedding for the products

    const productsEmbeding = await model.embedQuery(JSON.stringify(product));

    // Storing in pinecone index

    await pcIndex.namespace(`__${shop}__`).upsert([
      {
        id: product.id,
        values: productsEmbeding,
        metadata: {
          title: product.title,
          description: product.description,
          price: product.priceRangeV2.minVariantPrice.amount || "",
          shop: shop,
          shopId: userShop.documents[0]?.$id,
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

const productDeleteHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  // const sessionId = shopify.session.getOfflineId(shop);
  const product = JSON.parse(webhookRequestBody);
  console.log("webhook body", product);
  console.log("webhook id", webhookId);
  console.log("api version", apiVersion);
  console.log("topic", topic);
  const { adminDatabase } = CreateAdminClient();

  try {
    // fetching the shop id
    const userShop = await adminDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      [Query.equal("shop", shop)]
    );

    // deleting from pinecone index

    const deleteResponse = await pcIndex.namespace(`__${shop}__`).deleteMany({
      title: { $eq: product.title },
      shop: { $eq: shop },
      shopId: { $eq: userShop.documents[0]?.$id },
    });

    console.log("Delete Pinecone Response", deleteResponse);
  } catch (error) {
    console.log(error);
  }
};

const productUpdateHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  // const sessionId = shopify.session.getOfflineId(shop);

  const product = JSON.parse(webhookRequestBody);
  console.log("webhook body", product);
  console.log("webhook id", webhookId);
  console.log("api version", apiVersion);
  console.log("topic", topic);

  // updating embedding for the products

  const productsEmbeding = await model.embedQuery(JSON.stringify(product));

  //updating the index of pincone

  await pcIndex.namespace(`__${shop}__`).update({
    id: product.id,
    values: productsEmbeding,
    metadata: {
      title: product.title,
      description: product.description,
      price: product.priceRangeV2.minVariantPrice.amount || "",
    },
  });
};

export {
  setJwtCookie,
  getShopDetails,
  run,
  sendTwillioMessage,
  setCurrentShopCookie,
  productUpdateHandler,
  productCreateHandler,
  productDeleteHandler,
  customerCreateHandler,
  appUninstallHandler,
};
