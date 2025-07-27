import { getShopify } from "@/app/lib/shopify";
import { NextRequest, NextResponse } from "next/server";
// import { Models } from "node-appwrite";

export const GET = async (req: NextRequest) => {
  // get the shop from the cookie store

  const { shopify, appwritesessionStorage } = await getShopify();
  const shop = req.nextUrl.searchParams.get("shop");
  if (!shop) {
    return NextResponse.json(
      { error: "Missing shop parameter" },
      { status: 400 }
    );
  }

  const session = await appwritesessionStorage.loadSession(`offline_${shop}`);

  console.log("session:", session);

  if (!session) {
    return NextResponse.json(
      { error: "Could not find a session" },
      { status: 404 }
    );
  }
  try {
    const queryString = `query {
            shop {
                id,
                name,
            }
          }`;
    // shopify client initialization
    const client = new shopify.clients.Graphql({ session });
    const draftOrders = await client.request(queryString);
    // console.log(draftOrders);

    if (draftOrders.errors) {
      console.log(draftOrders.errors);
      return NextResponse.json(draftOrders.errors);
    }
    // await sessionStorage.disconnect();
    return NextResponse.json(draftOrders.data);
  } catch (error) {
    console.log(error);
  }
};
