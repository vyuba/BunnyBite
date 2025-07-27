// src/polar.ts
import "dotenv/config";

import { Polar } from "@polar-sh/sdk";

export const api = new Polar({
  server: "sandbox",
  accessToken: process.env.POLAR__SANDBOX_ACCESS_TOKEN!,
});
