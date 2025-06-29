import { NextRequest, NextResponse } from "next/server";
import { shopify } from "../../lib/shopify";

export const GET = async (req: NextRequest) => {
  console.log("GET request received");
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  // console.log("Shop:", shop);
  // Guard: req.url may be undefined during build/static generation
  if (!req.url) {
    return NextResponse.json(
      { error: "Request URL is missing" },
      { status: 400 }
    );
  }
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
