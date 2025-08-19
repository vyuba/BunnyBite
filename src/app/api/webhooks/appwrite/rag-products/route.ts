import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { pcIndex } from "@/app/lib/pinecone";
import { getShopify } from "@/app/lib/shopify";
import { OpenAIEmbeddings } from "@langchain/openai";

export const POST = async (req: NextRequest) => {
  //Getting the payload from the request

  const payload = await req.text();

  //Getting the signature from the header

  const signatureHeader = req.headers.get("x-appwrite-webhook-signature")!;

  const webhookUrl = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!;
  const signatureKey = process.env.YOUR_SECRET_HMAC_KEY!;

  // Hashing the the signature key i got with my webhook and payload to verify

  const expectedSignature = createHmac("sha1", signatureKey)
    .update(
      `https://${webhookUrl}/api/webhooks/appwrite/rag-products${payload}`
    )
    .digest("base64");

  // Comparing the hash with the signature gotten from the header

  if (expectedSignature !== signatureHeader) {
    console.error("Webhook verification failed");
    return new Response("Unauthorized", { status: 401 });
  }

  // if sucessfull parse the payload

  const { shop, $id } = JSON.parse(payload);

  //init shopify

  const { shopify, appwritesessionStorage } = await getShopify();

  const session = await appwritesessionStorage.loadSession(`offline_${shop}`);

  console.log("session:", session);

  if (!session) {
    return NextResponse.json(
      { error: "Could not find a session" },
      { status: 404 }
    );
  }

  try {
    //query for getting products

    const queryString = `query {
            products(first: 10) {
                nodes {
                    id
                    title
                    description
                    priceRangeV2 {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                      maxVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                }
            }
          }`;

    // shopify client initialization

    const client = new shopify.clients.Graphql({ session });
    const products = await client.request(queryString);

    // logging when getting products error

    if (products.errors) {
      console.log(products.errors);
      return NextResponse.json({ status: 400, error: products.errors });
    }

    // init the model for embedding

    const model = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-large",
      dimensions: 1024,
    });

    console.log("model:", model);
    // creating an embedding for the products

    const productsEmbeding = await model.embedQuery(
      JSON.stringify(products.data)
    );

    // Storing in pinecone index

    await pcIndex.upsert([
      {
        id: products.data.id || crypto.randomUUID(),
        values: productsEmbeding,
        metadata: {
          ...products.data,
          name: "bunny-bite",
          id: $id,
          shop: shop,
        },
      },
    ]);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, error: "Internal server error" });
  }
};
