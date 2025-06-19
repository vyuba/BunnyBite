import { cookies } from "next/headers";
import { createSessionClient } from "@/app/lib/node-appwrite";
import { NextResponse } from "next/server";

export const POST = async () => {
  const cookieStore = await cookies();

  const { account } = await createSessionClient();

  cookieStore.delete("my-custom-session");
  await account.deleteSession("current");
  return NextResponse.json({ success: true }, { status: 200 });
};
