export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getShopify } from "../../lib/shopify";

export const GET = async (req: NextRequest) => {
  const { shopify } = await getShopify();
  console.log("GET request received");
  // Guard: req.url may be undefined during build/static generation
  if (!req.url) {
    return NextResponse.json(
      { error: "Request URL is missing" },
      { status: 400 }
    );
  }
  let searchParams: URLSearchParams;
  try {
    searchParams = new URL(req.url).searchParams;
  } catch (e) {
    return NextResponse.json(
      { error: `${e?.message}, Invalid request URL` },
      { status: 400 }
    );
  }
  // const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  // console.log("Shop:", shop);
  if (!shop) {
    return NextResponse.json(
      { error: "shop parameter is required " },
      { status: 400 }
    );
  }
  const sanitizedShop = shopify.utils.sanitizeShop(shop, true);
  if (!sanitizedShop) {
    return NextResponse.json(
      { error: "Invalid shop parameter" },
      { status: 400 }
    );
  }
  try {
    return await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: "/api/callback",
      isOnline: false,
      rawRequest: req,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
};
