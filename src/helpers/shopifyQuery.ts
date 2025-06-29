"use server";
// import { headers } from "next/headers";
// import { databases } from "@/app/lib/node-appwrite";
// import { Models, Query } from "node-appwrite";
// import { Chats } from "@/types";

const fetchShop = async ({ shop }: { shop: string }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!;
    const response = await fetch(
      `https://${baseUrl}/api/shopify/shop?shop=${shop}`,
      {}
    );

    // console.log(response);

    const data = await response.json();
    console.log(data);
    if (data.error) {
      console.log(data.error);
      return null;
    }
    // const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching shop:", error);
  }
};

const fetchCustomerCount = async ({ shop }: { shop: string }) => {
  if (!shop) {
    throw new Error("Shop is required");
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!;
    const response = await fetch(
      `https://${baseUrl}/api/shopify/customer?shop=${shop}`,
      {}
    );

    // console.log(response);
    const data = await response.json();
    console.log(data);
    if (data.error) {
      console.log(data.error);
      return null;
    }
    // const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching shop:", error);
  }
};

export { fetchShop, fetchCustomerCount };
