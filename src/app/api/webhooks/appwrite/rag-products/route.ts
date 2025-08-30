import { NextRequest, NextResponse } from "next/server";
import { pcIndex } from "@/app/lib/pinecone";
import { getShopify } from "@/app/lib/shopify";
import { model } from "@/app/lib/openai";
// import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import { ID } from "appwrite";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
export const runtime = "nodejs"; // ensure Node, not Edge

export const POST = async (req: NextRequest) => {
  //init shopify

  try {
    const { shopify, appwritesessionStorage } = await getShopify();
    const { adminDatabase } = await CreateAdminClient();

    console.log("req headers", req.headers);
    const event = await req.headers["x-appwrite-event"];
    const doc = await req.json();

    if (!doc) {
      console.log("No document payload found");
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Common fields
    const {
      $id,
      shop,
      user,
      shop_number,
      twillio_auth_token,
      twillio_account_siid,
    } = doc;

    // Create event
    if (event.includes(".create")) {
      // 1. List Pinecone namespaces
      const nsList = await pcIndex.listNamespaces();
      const exists = nsList.namespaces.find((ns) => ns.name === `__${shop}__`);

      if (exists) {
        // Notify user because shop already exists
        await adminDatabase.createDocument(
          process.env.DATABASE_ID,
          process.env.APPWRITE_NOTIFICATION_COLLECTION_ID,
          ID.unique(),
          {
            user_id: user,
            message:
              "You already added the namespace added details. Thank you!",
          }
        );
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      // 2. Fetch products from Shopify

      const session = await appwritesessionStorage.loadSession(
        `offline_${shop}`
      );

      if (!session) {
        return NextResponse.json(
          { error: "Could not find a session" },
          { status: 404 }
        );
      }
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

      const client = new shopify.clients.Graphql({ session });

      const products = await client.request(queryString);

      // logging when getting products error

      if (products.errors) {
        console.log(products.errors);
        return NextResponse.json({ status: 400, error: products.errors });
      }

      // 3. Embed + upsert into Pinecone
      const vectors = await Promise.all(
        products.data.products.nodes.map(async (product) => {
          const emb = await model.embedQuery(
            `${product.title}. ${product.description}. ${product.priceRangeV2.minVariantPrice.amount}`
          );
          return {
            id: product.id,
            values: emb,
            metadata: {
              title: product.title,
              description: product.description,
              price: product.priceRangeV2.minVariantPrice.amount,
              shop: shop,
              shopId: $id,
            },
          };
        })
      );

      await pcIndex.namespace(`__${shop}__`).upsert(vectors);

      // 4. Notify
      await adminDatabase.createDocument(
        process.env.DATABASE_ID,
        process.env.APPWRITE_NOTIFICATION_COLLECTION_ID,
        ID.unique(),
        { user_id: user, message: "You just added your shop. Good job, champ!" }
      );
    }

    // Update event
    if (event.includes(".update")) {
      // Check if Twilio fields or shop_number were added
      if (twillio_account_siid || twillio_auth_token || shop_number) {
        await adminDatabase.createDocument(
          process.env.DATABASE_ID,
          process.env.APPWRITE_NOTIFICATION_COLLECTION_ID,
          ID.unique(),
          {
            user_id: user,
            message: "Congrats on adding your Twilio/Shop details 🎉",
          }
        );
      }
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, error: "Internal server error" });
  }
};

// //Getting the payload from the request

// const payload = await req.text();

// //Getting the signature from the header

// const signatureHeader = req.headers.get("x-appwrite-webhook-signature")!;

// const webhookUrl = process.env.NEXT_PUBLIC_SHOPIFY_APP_URL!;
// const signatureKey = process.env.YOUR_SECRET_HMAC_KEY!;

// // Hashing the the signature key i got with my webhook and payload to verify

// const expectedSignature = createHmac("sha1", signatureKey)
//   .update(
//     `https://${webhookUrl}/api/webhooks/appwrite/rag-products${payload}`
//   )
//   .digest("base64");

// // Comparing the hash with the signature gotten from the header

// if (expectedSignature !== signatureHeader) {
//   console.error("Webhook verification failed");
//   return new Response("Unauthorized", { status: 401 });
// }

// // if sucessfull parse the payload
