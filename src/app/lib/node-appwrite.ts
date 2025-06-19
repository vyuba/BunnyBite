import { Client, Databases, Account } from "node-appwrite";
import { cookies } from "next/headers";

const appwriteClient = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
      "https://fra.cloud.appwrite.io/v1"
  )
  .setProject(
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "683b2c75001dafa45447"
  )
  .setKey(
    process.env.NEXT_APPWRITE_KEY ||
      "standard_f4a270c3b1b7eacf9ce7aaf1507cbef112fab1d9880ea19be54c55a8762da0e89168d71c934819ae357f65fbf40e193412635b266c08730a27a0528f8599f10dc35e0615daadf99a1ef80994f306d9632d506449bb4fdf5c49ef4a2c1653aa72c8ce2b3b3c7811989eca3627502fa642ac179531b400f1628f6feff22de4f3f1"
  );

const databases = new Databases(appwriteClient);

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

async function createAdminClient() {
  return {
    get account() {
      return new Account(appwriteClient);
    },
  };
}

export { databases, appwriteClient, createSessionClient, createAdminClient };
