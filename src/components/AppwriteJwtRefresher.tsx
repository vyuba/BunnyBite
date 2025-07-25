"use client";

import { useEffect } from "react";
import { clientAccount } from "@/app/lib/client-appwrite";
import { setJwtCookie } from "@/utils";
// import { createClient } from "@/app/lib/node-appwrite";

const AppwriteJWTRefresher = () => {
  useEffect(() => {
    const refreshJWT = async () => {
      try {
        const jwt = await clientAccount.createJWT();

        // client.headers["X-Appwrite-JWT"] = jwt.jwt;
        // console.log("New JWT set:", jwt.jwt);
        setJwtCookie(jwt);
        // const { appwriteClient } = await createClient();

        // appwriteClient.headers["X-Appwrite-JWT"] = jwt.jwt;
      } catch (err) {
        console.error("Failed to refresh JWT:", err);
      }
    };

    // Refresh JWT immediately
    refreshJWT();

    // Then refresh every 14 minutes (JWT expires in 15)
    const interval = setInterval(refreshJWT, 14 * 60 * 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return null; // or a hidden div if needed
};

export default AppwriteJWTRefresher;
