import { OpenAIEmbeddings } from "@langchain/openai";

export const model = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-large",
  dimensions: 1024,
});
