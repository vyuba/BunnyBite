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
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setJWT(token);

  // console.log(appwriteClient.headers);
  // console.log(token);
  if (token === appwriteClient.headers["X-Appwrite-JWT"]) {
    console.log("MATCHED--JWT-TOKEN", true);
  } else {
    console.log("NOT-MATHCED--JWT-TOKEN", false);
  }
  // console.log(appwriteClient.headers["X-Appwrite-JWT"]);

  return {
    appwriteClient,
    databases: new Databases(appwriteClient),
  };
};

const CreateAdminClient = () => {
  try {
    const adminClient = new Client()
      .setEndpoint(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
          "https://fra.cloud.appwrite.io/v1"
      )
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setKey(process.env.NEXT_APPWRITE_KEY!);

    const adminDatabase = new Databases(adminClient);

    return {
      adminClient,
      adminDatabase,
    };
  } catch (error) {
    console.log(error.message);
  }
};

export { createClient, CreateAdminClient };
