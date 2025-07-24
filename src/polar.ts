// src/polar.ts
import { Polar } from "@polar-sh/sdk";

export const api = new Polar({
  server: "sandbox", // Use this option if you're using the sandbox environment - else use 'production' or omit the parameter
  accessToken: "polar_oat_vHXsnykgQgjUwRVHrq7c3qUBbxrNB45r0IzLz4g9x0N",
  // process.env.POLAR_ACCESS_TOKEN ||

  // "polar_oat_8ZK3Up7CfURt7tzYjl8pXRtmMQeOuvNE3T7Iu0IqR0d",
});
