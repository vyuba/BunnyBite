/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import { z } from "zod";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool, Tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { ID } from "appwrite";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
import { pcIndex } from "@/app/lib/pinecone";
import { model as openaiEmbeddings } from "@/app/lib/openai";
import { MemorySaver } from "@langchain/langgraph";
import type { Shop } from "@/types";

// ---------------- State ----------------
const State = Annotation.Root({
  ...MessagesAnnotation.spec, // keeps a running transcript (BaseMessage[])
  output: Annotation<string>({
    reducer: (x, y) => x.concat(y),
    default: () => "",
  }),
});

const DEFAULT_SYSTEM = `
You are a friendly, shop-aware customer support agent.
You only handle:
1) Refund requests (use save_refund),
2) Order tracking (use tracking_tool),
3) Shop context / FAQs via RAG (use rag_fetch).
Follow shop tone and policies. Call tools with correct JSON. Keep replies concise.
`;

// ---------------- Helpers ----------------
async function getShopPersonality(shopId: Shop["$id"]): Promise<string> {
  try {
    const { adminDatabase } = CreateAdminClient();
    const shop: Shop = await adminDatabase.getDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      shopId
    );
    return shop?.personality?.trim() || DEFAULT_SYSTEM.trim();
  } catch {
    return DEFAULT_SYSTEM.trim();
  }
}

// ---------------- Tools ----------------

// 1) Track order
const tracking_tool = tool(
  async ({ orderId }: { orderId: string }, config: RunnableConfig) => {
    const shop_name = config.configurable?.shop_name as string;
    if (!orderId || shop_name)
      throw new Error("orderId or shop name is required");

    const url = `https://${process.env
      .NEXT_PUBLIC_SHOPIFY_APP_URL!}/api/shopify/getOrder?orderId=${encodeURIComponent(
      orderId
    )}&shop=${shop_name}`;

    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Failed to fetch order: ${res.status} ${res.statusText}`);
    const json = await res.json();
    return json;
  },
  {
    name: "tracking_tool",
    description: "Get order details & tracking by orderId.",
    schema: z.object({ orderId: z.string().describe("The Shopify order ID") }),
  }
);

// 2) Save refund
const save_refund = tool(
  async (
    { name, id, reason }: { name: string; id: string; reason: string },
    config: RunnableConfig
  ) => {
    const shopId = config.configurable?.shop_id as string;
    if (!name || !id || !reason || !shopId)
      throw new Error("Missing refund fields");

    const { adminDatabase } = CreateAdminClient();
    const doc = await adminDatabase.createDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_REFUND_COLLECTION_ID!,
      ID.unique(),
      {
        isActive: true,
        user_name: name,
        details: reason,
        orderId: id,
        shopId,
      }
    );
    return { status: "submitted", refund_doc_id: doc.$id };
  },
  {
    name: "save_refund",
    description: "Submit a refund request with user info.",
    schema: z.object({
      name: z.string().describe("Customer full name"),
      id: z.string().describe("Order ID"),
      reason: z.string().describe("Short reason/issue"),
    }),
  }
);

// 3) RAG fetch
const rag_fetch = tool(
  async ({ query }: { query: string }, config: RunnableConfig) => {
    const shopId = config.configurable?.shop_id as string;
    const shop_name = config.configurable?.shop_name as string;
    if (!query || !shopId || !shop_name)
      throw new Error("Missing query or shopId or shop name");

    const namespace = pcIndex.namespace(`__${shop_name}__`);
    const vector = await openaiEmbeddings.embedQuery(query);
    const result = await namespace.query({
      vector,
      topK: 8,
      filter: { shopId: { $eq: shopId } },
      includeValues: false,
      includeMetadata: true,
    });

    return (result.matches || []).map((m) => ({
      source: m.metadata?.title ?? "unknown",
      price: m.metadata?.price ?? null,
      description: m.metadata?.description ?? "",
    }));
  },
  {
    name: "rag_fetch",
    description:
      "Retrieve shop-specific context (policies, FAQs, product blurbs) relevant to the user's question.",
    schema: z.object({
      query: z.string().describe("What to search for in the shop knowledge"),
    }),
  }
);

const tools = [tracking_tool, save_refund, rag_fetch];
const toolNode = new ToolNode<typeof State.State>(tools);

// ---------------- Nodes ----------------

/** Compose system prompt (shop personality) and add the user's message if provided via config */
async function composeNode(state: typeof State.State, config: RunnableConfig) {
  const shopId = config.configurable?.shop_id as string | undefined;
  const systemText = await getShopPersonality(shopId as string);
  const sys = new SystemMessage(systemText);

  // If caller passed a fresh user message in `state.messages`, keep it; else just inject system.
  // (Your route supplies a HumanMessage via Command resume, so we just prepend system.)
  return { messages: [sys] as BaseMessage[] };
}

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY!,
}).bindTools(tools);

/** Call the model with [System, ...history]. */
async function llmNode(state: typeof State.State) {
  // Find the one SystemMessage we injected in composeNode (first), then append history
  const msgs = [...state.messages, new SystemMessage(DEFAULT_SYSTEM)];

  const ai = await llm.invoke(msgs);
  return { messages: [ai] as BaseMessage[] };
}

/** Router: if the latest AIMessage has tool calls -> tools; else END */
function router(state: typeof State.State) {
  const last = state.messages[state.messages.length - 1];
  if (last instanceof AIMessage) {
    const toolCalls = last.tool_calls ?? last.additional_kwargs?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length) return "tools";
  }
  return END;
}

/** After final model turn, set state.output to the last AI message content */
async function finalizeNode(state: typeof State.State) {
  const last = state.messages[state.messages.length - 1];
  const content =
    last instanceof AIMessage
      ? String(last.content)
      : "Sorry, I couldn’t produce a reply.";
  return { output: content };
}

// ---------------- Graph ----------------
const checkpointer = new MemorySaver();

export const graph = new StateGraph(State)
  .addNode("compose", composeNode)
  .addNode("llm", llmNode)
  .addNode("tools", toolNode)
  .addNode("finalize", finalizeNode)
  .addEdge(START, "compose")
  .addEdge("compose", "llm")
  .addConditionalEdges("llm", router, { tools: "tools", [END]: "finalize" })
  .addEdge("tools", "llm")
  .compile({ checkpointer });
