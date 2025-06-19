import { NextRequest, NextResponse } from "next/server";
import {
  sessionStorage,
  appwritesessionStorage,
  shopify,
} from "../../lib/shopify";
import { createSHA256HMAC, HashFormat } from "@shopify/shopify-api/runtime";
// import { databases } from "@/app/lib/node-appwrite";
// import { Models, ID, Query } from "node-appwrite";

interface Params {
  [key: string]: string;
}
export const GET = async (req: NextRequest) => {
  console.log("shopify Callback route hit");
  const { searchParams } = new URL(req.url);
  const hmac = searchParams.get("hmac");
  const shop = searchParams.get("shop");

  const params: Params = {};

  searchParams.forEach((value, key) => {
    if (key != "hmac") {
      params[key] = value || ""; // Store the value in the object using the key as the property name
      // console.log("value:", value, "key:", key);
    }
  });

  const SHOPIFY_REDIRECT_URL = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  if (!hmac) {
    return NextResponse.json(
      { error: "Missing hmac parameter" },
      { status: 400 }
    );
  }

  const hashedString = await createSHA256HMAC(
    process.env.SHOPIFY_API_SECRET!,
    SHOPIFY_REDIRECT_URL,
    HashFormat.Hex
  );

  if (hashedString !== hmac) {
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 400 });
  }

  if (!shop) {
    return NextResponse.json(
      { error: "Missing shop parameter" },
      { status: 400 }
    );
  }

  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: NextResponse,
    });
    // console.log("Authenticated:", callback.session);
    sessionStorage.storeSession(callback.session);
    appwritesessionStorage.storeSession(callback.session);
    // const checkShop = await databases.listDocuments<Models.Document>(
    //   process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    //   process.env.NEXT_PUBLIC_USER_COLLECTION_ID!,
    //   [Query.equal("shop", callback.session.shop)]
    // );
    // if (checkShop.documents.length > 0) {
    //   console.log("Shop already exists");
    //   return NextResponse.json(
    //     { error: "Shop already exists" },
    //     { status: 400 }
    //   );
    // }
    // let promise = await databases.createDocument<Models.Document>(
    //   process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
    //   process.env.NEXT_PUBLIC_USER_COLLECTION_ID!,
    //   ID.unique(),
    //   {
    //     shop: callback.session.shop,
    //   }
    // );

    // console.log(promise);

    const webhookResponse = await shopify.webhooks.register({
      session: callback.session,
    });

    console.log(webhookResponse["APP_UNINSTALLED"]);
    console.log(
      `Successfully registered ${webhookResponse["APP_UNINSTALLED"][0]} webhook`
    );

    if (!webhookResponse["APP_UNINSTALLED"][0].success) {
      console.log(
        `Failed to register APP_UNINSTALLED webhook: ${webhookResponse["APP_UNINSTALLED"][0].result}`
      );
    }

    const redirectUrl = new URL(
      `${process.env.SHOPIFY_APP_URL}/register`,
      req.url
    );
    redirectUrl.searchParams.append("shop", shop);

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("shop", shop, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
};
