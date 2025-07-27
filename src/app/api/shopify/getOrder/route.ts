import { getShopify } from "@/app/lib/shopify";
import { ApiVersion } from "@shopify/shopify-api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { shopify, appwritesessionStorage } = await getShopify();

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const shop = searchParams.get("shop");

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
    // const order = await shopify.rest.Order.find({
    //   session: session,
    //   apiVersion: ApiVersion.July23,
    //   id: orderId,
    // });

    // const queryString = `query {
    //         orderByIdentifier(identifier: { name: ${orderId} }) {
    //             id
    //             name
    //             email
    //             fulfillments(first: 10) {
    //                 trackingInfo {
    //                     number
    //                     url
    //                     company
    //                 }
    //             }
    //             totalPriceSet {
    //                 shopMoney {
    //                     amount
    //                     currencyCode
    //                 }
    //             }
    //             createdAt
    //             lineItems(first: 10) {
    //                 edges {
    //                     node {
    //                         title
    //                         quantity
    //                     }
    //                 }
    //             }
    //         }
    //       }`;

    // shopify client initialization

    const client = new shopify.clients.Rest({
      session,
      apiVersion: ApiVersion.July23,
    });
    const order = await client.get({
      path: `orders/#${orderId}`,
      query: { status: "any" },
    });

    console.log(order);

    return NextResponse.json(order);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "server error" + error },
      { status: 500 }
    );
  }
};
