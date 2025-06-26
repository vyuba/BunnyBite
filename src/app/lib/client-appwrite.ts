import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT! ||
      "https://fra.cloud.appwrite.io/v1"
  )
  .setProject(
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT! || "683b2c75001dafa45447"
  );

const clientAccount = new Account(client);
const clientDatabase = new Databases(client);

export { clientAccount, clientDatabase };
