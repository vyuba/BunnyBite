"use server";
import {
  shopifyApi,
  LATEST_API_VERSION,
  DeliveryMethod,
} from "@shopify/shopify-api";
// import { MySQLSessionStorage } from "@shopify/shopify-app-session-storage-mysql";
import "@shopify/shopify-api/adapters/web-api";
import { AppwriteSessionStorage } from "@/helpers/appwrite-session-storage";
import { CreateAdminClient } from "./node-appwrite";
import {
  appUninstallHandler,
  productCreateHandler,
  productUpdateHandler,
  customerCreateHandler,
} from "@/utils";

// handlers for webhook events

// MySQL Session Storage
// const sessionStorage = MySQLSessionStorage.withCredentials(
//   process.env.MYSQL_HOST!,
//   process.env.MYSQL_DB!,
//   process.env.MYSQL_USER!,
//   process.env.MYSQL_PASS!,
//   { connectionPoolLimit: 100000 }
// );

// // Appwrite Session Storage
// Create session storage instance

export async function getShopify() {
  const { adminClient } = await CreateAdminClient();

  const appwritesessionStorage = new AppwriteSessionStorage(
    adminClient,
    process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    process.env.NEXT_PUBLIC_USER_COLLECTION_ID!
  );

  // appwritesessionStorage.storeSession();

  // Initialize migrations

  // Shopify init
  const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY!,
    apiSecretKey: process.env.SHOPIFY_API_SECRET!,
    scopes: [
      "read_orders",
      "write_orders",
      "read_customers",
      "write_customers",
      "read_products",
    ],
    hostName: new URL(`https://${process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!}`)
      .host,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
    sessionStorage: appwritesessionStorage,
    useOnlineTokens: false,
  });

  shopify.webhooks.addHandlers({
    APP_UNINSTALLED: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (
          topic: string,
          shop: string,
          webhookRequestBody: string,
          webhookId: string,
          apiVersion: string | undefined
        ) => {
          await appUninstallHandler(
            topic,
            shop,
            webhookRequestBody,
            webhookId,
            apiVersion!
          );
        },
      },
    ],
    CUSTOMERS_CREATE: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (
          topic: string,
          shop: string,
          webhookRequestBody: string,
          webhookId: string,
          apiVersion: string | undefined
        ) => {
          await customerCreateHandler(
            topic,
            shop,
            webhookRequestBody,
            webhookId,
            apiVersion!
          );
        },
      },
    ],
    PRODUCTS_CREATE: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (
          topic: string,
          shop: string,
          webhookRequestBody: string,
          webhookId: string,
          apiVersion: string | undefined
        ) => {
          await productCreateHandler(
            topic,
            shop,
            webhookRequestBody,
            webhookId,
            apiVersion!
          );
        },
      },
    ],
    PRODUCTS_UPDATE: [
      {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (
          topic: string,
          shop: string,
          webhookRequestBody: string,
          webhookId: string,
          apiVersion: string | undefined
        ) => {
          await productUpdateHandler(
            topic,
            shop,
            webhookRequestBody,
            webhookId,
            apiVersion!
          );
        },
      },
    ],
  });

  shopify.webhooks.getTopicsAdded();
  return { shopify, appwritesessionStorage };
}
