"use server";
import { Client, Databases, Account } from "node-appwrite";
import { cookies } from "next/headers";

const createClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  const appwriteClient = new Client()
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        "https://fra.cloud.appwrite.io/v1"
    )
    .setProject(
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "683b2c75001dafa45447"
    )
    .setJWT(token);

  const databases = new Databases(appwriteClient);
  return {
    appwriteClient,
    databases,
  };
};

// client session helper

async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const cookieStore = await cookies();

  const session = cookieStore.get("my-custom-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

// server session helper

// async function createAdminClient() {
//   return {
//     get account() {
//       return new Account(appwriteClient);
//     },
//   };
// }

export { createClient, createSessionClient };
