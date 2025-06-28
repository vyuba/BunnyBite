import {
  shopifyApi,
  LATEST_API_VERSION,
  DeliveryMethod,
} from "@shopify/shopify-api";
import { MySQLSessionStorage } from "@shopify/shopify-app-session-storage-mysql";
import "@shopify/shopify-api/adapters/web-api";
import { AppwriteSessionStorage } from "@/helpers/appwrite-session-storage";
import { appwriteClient } from "./node-appwrite";

// handlers for webhook events

const appUninstallHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: string
) => {
  const sessionId = shopify.session.getOfflineId(shop);
  const webhookBody = JSON.parse(webhookRequestBody);
  console.log("webhook body", webhookBody);
  console.log("webhook id", webhookId);
  console.log("api version", apiVersion);
  console.log("topic", topic);
  await sessionStorage.deleteSession(sessionId);
  await appwritesessionStorage.deleteSession(sessionId);
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

// MySQL Session Storage
const sessionStorage = MySQLSessionStorage.withCredentials(
  process.env.MYSQL_HOST!,
  process.env.MYSQL_DB!,
  process.env.MYSQL_USER!,
  process.env.MYSQL_PASS!,
  { connectionPoolLimit: 100000 }
);

// // Appwrite Session Storage
// Create session storage instance
const appwritesessionStorage = new AppwriteSessionStorage(
  appwriteClient,
  process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
  process.env.NEXT_PUBLIC_USER_COLLECTION_ID!
);

// appwritesessionStorage.storeSession();

// Initialize migrations

// Shopify init
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ["read_orders", "write_orders", "read_customers", "write_customers"],
  hostName: new URL(process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!).host,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  sessionStorage: appwritesessionStorage,
  useOnlineTokens: false,
  // webhooks: {
  //   path: "/api/webhooks",
  //   allowedTopics: ["APP_UNINSTALLED", "CUSTOMERS_CREATE"],
  // },
  // webhooks: [
  //   {
  //     topics: ["app/uninstalled"],
  //     url: "/api/webhooks/app_uninstalled",
  //     callback: appUninstallHandler,
  //   },
  // ],
});
// webhooks: {
//   path: "/webhooks",
//   allowedTopics: ["APP_UNINSTALLED"],
// },

// const appUninstallHandler = async (
//   topic,
//   shop,
//   webhookRequestBody,
//   webhookId,
//   apiVersion
// ) => {
//   try {
//     /** @type {AppUninstalled} */
//     const webhookBody = JSON.parse(webhookRequestBody);

//     await prisma.session.deleteMany({ where: { shop } });
//     await prisma.stores.upsert({
//       where: { shop: shop },
//       update: { isActive: false },
//       create: { shop: shop, isActive: false },
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };

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
});

shopify.webhooks.getTopicsAdded();

export { shopify, sessionStorage, appwritesessionStorage };
