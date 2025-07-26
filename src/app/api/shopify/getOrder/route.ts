import { getShopify } from "@/app/lib/shopify";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { shopify, appwritesessionStorage } = await getShopify();

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  const cookieStore = await cookies();
  const shop = cookieStore.get("shop");

  console.log(cookieStore);

  console.log("--SHOP--", shop);

  if (!shop) {
    return NextResponse.json(
      { error: "Missing shop parameter" },
      { status: 400 }
    );
  }

  const session = await appwritesessionStorage.loadSession(`offline_${shop}`);

  // console.log("testingSession:", testingSession);

  console.log("session:", session);

  if (!session) {
    return NextResponse.json(
      { error: "Could not find a session" },
      { status: 404 }
    );
  }
  try {
    const queryString = `query {
            orderByIdentifier(identifier: { name: ${orderId} }) {
                id
                name
                email
                fulfillments(first: 10) {
                    trackingInfo {
                        number
                        url
                        company
                    }
                }
                totalPriceSet {
                    shopMoney {
                        amount
                        currencyCode
                    }
                }
                createdAt
                lineItems(first: 10) {
                    edges {
                        node {
                            title
                            quantity
                        }
                    }
                }
            }
          }`;

    // shopify client initialization

    const client = new shopify.clients.Graphql({ session });
    const order = await client.request(queryString);

    console.log(order);

    if (order.errors) {
      console.log(order.errors);
      return NextResponse.json(order.errors);
    }
    // await sessionStorage.disconnect();
    return NextResponse.json(order.data);
  } catch (error) {
    console.log(error);
  }
};
