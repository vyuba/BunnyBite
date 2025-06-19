// middleware.js
// import { NextRequest, NextResponse } from "next/server";
// import { createSessionClient } from "@/app/lib/node-appwrite";

// export async function middleware(request: NextRequest) {
//   const { account } = await createSessionClient();
//   try {
//     await account.get(); // Checks if a session exists
//     return NextResponse.next(); // User is logged in, proceed
//   } catch (error) {
//     // No valid session, redirect to login
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// // Configure middleware to run on specific routes
// export const config = {
//   matcher: ["/dashboard/:path*"], // Apply to dashboard routes
// };
