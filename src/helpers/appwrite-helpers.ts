import {
  createSessionClient,
  createAdminClient,
} from "@/app/lib/node-appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// check logged in user

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.log("Error getting logged in user:", error);
    return null;
  }
}

// sign up user with email and password
export async function signUpWithEmail(formData: FormData) {
  "use server";
  const email = formData.get("email");
  const password = formData.get("password");

  const cookieStore = await cookies();

  const { account } = await createAdminClient();

  await account.create(ID.unique(), email as string, password as string);
  const session = await account.createEmailPasswordSession(
    email as string,
    password as string
  );

  cookieStore.set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/dashboard");
}
