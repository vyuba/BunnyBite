"use server";
import { cookies } from "next/headers";
import { Models } from "node-appwrite";
import { createClient } from "./app/lib/node-appwrite";
import { api } from "./polar";

const setJwtCookie = async (key: Models.Jwt) => {
  (await cookies()).set("jwt", key?.jwt, {
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  });
  // console.log(key);
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
async function run(userid) {
  const checkout = await api.checkouts.create({
    products: ["02925bc2-8a50-4ab1-8d0d-efc181b481d1"],
    externalCustomerId: userid,
  });

  console.log(checkout.url);
}
export { setJwtCookie, getShopDetails, run };
