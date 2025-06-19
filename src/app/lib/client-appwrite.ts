import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const clientAccount = new Account(client);
const clientDatabase = new Databases(client);

export { clientAccount, clientDatabase };
