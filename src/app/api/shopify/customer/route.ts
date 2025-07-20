import { getShopify } from "@/app/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  // get the shop from the cookie store

  const shop = req.nextUrl.searchParams.get("shop");
  if (!shop) {
    return NextResponse.json(
      { error: "Missing shop parameter" },
      { status: 400 }
    );
  }
  const { shopify, appwritesessionStorage } = await getShopify();
  console.log("shop:", shop);

  // await sessionStorage.ready;
  // console.log("hasCookie:", hasCookie);
  const session = await appwritesessionStorage.loadSession(`offline_${shop}`);

  console.log("session:", session);

  if (!session) {
    console.log("Could not find a session");
    return NextResponse.json(
      { error: "Could not find a session" },
      { status: 404 }
    );
  }
  try {
    const queryString = `query {
            customersCount {
                count,
            }
          }`;
    // shopify client initialization
    const client = new shopify.clients.Graphql({ session });
    const draftCustomerCount = await client.request(queryString);
    // console.log(draftCustomerCount);

    if (draftCustomerCount.errors) {
      console.log(draftCustomerCount.errors);
      return NextResponse.json(draftCustomerCount.errors);
    }
    // await sessionStorage.disconnect();
    return NextResponse.json(draftCustomerCount.data);
  } catch (error) {
    console.log(error);
  }
};
