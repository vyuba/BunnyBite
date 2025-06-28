import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
console.log(projectDir);
loadEnvConfig(projectDir);
