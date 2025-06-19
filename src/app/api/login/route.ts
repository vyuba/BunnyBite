import { cookies } from "next/headers";
import { createAdminClient } from "@/app/lib/node-appwrite";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    console.log(formData);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }
    const cookieStore = await cookies();
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(
      email.toString(),
      password.toString()
    );
    cookieStore.set("my-custom-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }
};
