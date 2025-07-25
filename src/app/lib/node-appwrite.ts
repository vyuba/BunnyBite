"use server";
import { Client, Databases } from "node-appwrite";
import { cookies } from "next/headers";

const createClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  // console.log(token);
  const appwriteClient = new Client()
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        "https://fra.cloud.appwrite.io/v1"
    )
    .setProject(
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "683b2c75001dafa45447"
    )
    .setJWT(token);

  // console.log(appwriteClient.headers);
  // console.log(token);
  if (token === appwriteClient.headers["X-Appwrite-JWT"]) {
    console.log("MATCHED--JWT-TOKEN", true);
  } else {
    console.log("NOT-MATHCED--JWT-TOKEN", false);
  }
  // console.log(appwriteClient.headers["X-Appwrite-JWT"]);

  const databases = new Databases(appwriteClient);
  return {
    appwriteClient,
    databases,
  };
};

export { createClient };
