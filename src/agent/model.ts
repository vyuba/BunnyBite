import { z } from "zod";
import "../../envConfig";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { END, interrupt, MemorySaver } from "@langchain/langgraph";
import { CreateAdminClient } from "@/app/lib/node-appwrite";
// import { Command } from "@langchain/langgraph";
// import readline from "readline";
import { tool } from "@langchain/core/tools";
import { ID } from "appwrite";
import {
  Annotation,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import "dotenv/config";
import { RunnableConfig } from "@langchain/core/runnables";
import { pcIndex } from "@/app/lib/pinecone";
import { model } from "@/app/lib/openai";
import { Shop } from "@/types";

//STATE ANNOTATOIN

const State = Annotation.Root({
  ...MessagesAnnotation.spec,
  action: Annotation<"save" | "update">,
  // shopId: Annotation<string>,
  some_text: Annotation<string>,
  output: Annotation<string>,
});

//THE ORDER TYPE RESPONSE

export type OrderByIdentifierResponse = {
  data: {
    orderByIdentifier: {
      id: string;
      name: string;
      fulfillments: {
        trackingInfo: Array<{
          number: string | null;
          url: string | null;
          company: string | null;
        }>;
      }[];
    } | null;
  };
};

// SYSTEM PROMPT

const SYSTEM_PROMPT = `
You are a friendly customer support agent with an e-commerce brand, conversational tone. Your role is to assist with ONLY the following:
1. Refund requests (using the save-refund tool).
2. Order tracking (using the tracking_tool).
3. Saving and finishing the session.

Steps:
0. Start with: "Hello! I can help with refunds, order tracking, or saving your session. What do you need assistance with?"
1. Start with a brief, friendly exchange to understand the customer's issue.
2. Based on their response, identify if the request is for a refund, order tracking, or saving the session.
3. Follow these strict rules:

- **Refund Request**:
  - Ask for: Full name, Order ID, and a brief description of the issue.
  - Summarize the details and ask: “Is everything correct? Would you like to proceed with the refund?”
  - If confirmed, call the **save-refund** tool.
  - On success, say: “Refund request submitted successfully. Is there anything else I can help with?”
  - If they say no, set action to **'save'**.

- **Tracking Request**:
  - Ask for the Order ID.
  - Call the **tracking_tool** with the Order ID and share the tracking details also tell the customer about what they ordered.
  - The **tracking_tool** returns an Order back with a order json back response so you can get all the details if nothing is returned then the customer does not have any active order.

- **Save and Finish Request**:
  - Ask: “Do you want to save your session and finish later?”
  - If confirmed, set action to **'save'**.

 - **Other**: Respond: “Sorry, I can only assist with refunds, order tracking, or saving your session. Please contact the appropriate support team for other inquiries.”
- Do NOT offer any other assistance or perform actions outside these tasks.

Important: Do NOT perform any actions or call any tools except **save-refund**, **tracking_tool**, or setting the action to **'save'**.
`;

// get shop personality

const getShopPersonality = async (shopId: Shop["$id"]) => {
  try {
    const { adminDatabase } = CreateAdminClient();
    const shop: Shop = await adminDatabase.getDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
      shopId
    );
    console.log(shop);

    return shop.personality;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

//THE SAVE REFUND TOOL

const saveRefund = tool(
  async (
    params: { name: string; id: string; reason: string },
    config: RunnableConfig
  ) => {
    const { adminDatabase } = CreateAdminClient();
    const { name, id, reason } = params;
    const shopId = config["configurable"].get("shop_id");
    console.log("--CALLING-THE-REFUND-FUNCTION--");

    console.log({ name, reason, id, shop: shopId });

    if (!name || !id || !reason || !shopId) {
      throw new Error("Provide all the fields");
    }

    try {
      const refund = await adminDatabase.createDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_REFUND_COLLECTION_ID!,
        ID.unique(),
        {
          isActive: true,
          user_name: name,
          details: reason,
          orderId: id,
          shopId: shopId,
        }
      );
      console.log(refund);
      return refund;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },
  {
    name: "save-refund",
    description: "Call this function to save refund details",
    schema: z.object({
      name: z
        .string()
        .describe("The name the user provided for the refund request."),
      id: z
        .string()
        .describe("The order id provded by the user for the refund request."),
      reason: z
        .string()
        .describe("The brief description of the issue the user is having."),
    }),
  }
);

// THE ORDER TRACKING ORDER TOOL

const trackingOrder = tool(
  async ({ orderId }): Promise<OrderByIdentifierResponse> => {
    console.log("--CALLING-THE-GET-TRACKING-FUNCTION--");

    if (!orderId) {
      throw new Error("Provide all the fields");
    }

    try {
      const response = await fetch(
        `https://${process.env
          .NEXT_PUBLIC_SHOPIFY_APP_URL!}/api/shopify/getOrder?orderId=${orderId}&shop=customthem.myshopify.com`,
        {
          credentials: "include",
        }
      );

      if (!response?.ok) {
        throw new Error(`Failed to fetch order: ${response?.statusText}`);
      }

      const order = await response.json();

      return order;
    } catch (error) {
      return error;
    }
  },
  {
    name: "tracking_tool",
    description: "Retrieves tracking information from the order json order.",
    schema: z.object({
      orderId: z.string(),
    }),
  }
);

//THE OUTPUT SCHEMA FOR THE LLM

const outputSchema = z.object({
  action: z
    .enum(["save", "update"])
    .describe(
      "The action to perform, either 'save' or 'update', but the deafault is update"
    ),
  content: z.string().describe("This is where you put in your response"),
});

// LLM INITIALIZATION

const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY!,
});

//THE REACT AGENT

const agent = createReactAgent({
  llm,
  prompt: SYSTEM_PROMPT,
  tools: [saveRefund, trackingOrder],
  responseFormat: outputSchema,
});
// .withStructuredOutput(zodToJsonSchema(outputSchema))
// .bindTools(tools);

//THE FIRST NODE

const myNode = async (state: typeof State.State, config: RunnableConfig) => {
  const shopId = config["configurable"].get("shop_id");

  //fetching the personality

  const shopPersonality = await getShopPersonality(shopId);

  let user_message;
  const system_message = new SystemMessage({ content: shopPersonality });
  if (state.messages.length === 0) {
    const user_input = "Hello";
    user_message = new HumanMessage({ content: user_input });
  } else {
    const value = interrupt({
      user_input: state.some_text,
    });
    if (value) {
      console.log("USER:", value.user_input);
      user_message = new HumanMessage({ content: value.user_input });
    }
  }

  const response = await agent.invoke({
    messages: [...state.messages, system_message, user_message],
  });
  console.log("AI:", response.structuredResponse.content);
  console.log("action", response.structuredResponse.action);
  return {
    document: response.structuredResponse.content,
    messages: [
      ...state.messages,
      user_message,
      new AIMessage({ content: response.structuredResponse.content }),
    ],
    action: response.structuredResponse.action,
    output: response.structuredResponse.content,
  };
};

//ROUTING NODE

const routingFunction = async (state: typeof State.State) => {
  const query = state.messages[state.messages.length - 1].content as string;
  // If query looks like knowledge, do RAG
  if (query.toLowerCase().includes("rag")) {
    return "rag";
  }
  if (state.action === "save") {
    return "end";
  }

  return "root";
};

// RAG NODE

async function ragNode(state: typeof State.State, config: RunnableConfig) {
  let query;
  let user_message;
  if (state.messages.length === 0) {
    const user_input = "Hello";
    user_message = new HumanMessage({ content: user_input });
  } else {
    const value = interrupt({
      user_input: state.some_text,
    });
    if (value) {
      console.log("USER:", value.user_input);
      query = value.user_input;
      user_message = new HumanMessage({ content: value.user_input });
    }
  }

  console.log("config", config.configurable);
  const shopId = config.configurable.shop_id;

  const namespace = pcIndex.namespace("__default__");

  const queryVector = await model.embedQuery(query);

  const response = await namespace.query({
    vector: queryVector,
    topK: 10,
    filter: {
      shopId: { $eq: shopId },
    },
    includeValues: false,
    includeMetadata: true,
  });
  // console.log(response);

  const context = response.matches.map((response) => {
    const productInfo = `
           Product Name: ${response.metadata.title}\nProduct Price: ${response.metadata.price}\nProduct Description: ${response.metadata.description}
    `;
    return productInfo;
  });

  // const answer = await llm.invoke([
  //   new HumanMessage(`Use this context to answer:\n${context}\n\nQ: ${query}`),
  // ]);

  // console.log(answer.content);
  const agentResponse = await agent.invoke({
    messages: [
      ...state.messages,
      user_message,
      new HumanMessage(
        `Use this context to answer:\n${context}\n\nQ: ${query}`
      ),
    ],
  });
  // console.log(answer.content);

  return {
    messages: [
      ...state.messages,
      new AIMessage({ content: agentResponse.structuredResponse.content }),
    ],
    action: agentResponse.structuredResponse.action,
    output: agentResponse.structuredResponse.content,
  };
}

// GRAPH INIT

const checkpointer = new MemorySaver();
export const graph = new StateGraph(State)
  .addNode("root", myNode)
  .addNode("rag", ragNode)
  .addEdge("__start__", "rag")
  .addConditionalEdges("root", routingFunction, {
    end: END,
    root: "root",
    rag: "rag",
  })
  .addEdge("rag", END)
  .compile({ checkpointer });
// import { StructuredOutputParser } from "@langchain/core/output_parsers";

// const main = async () => {
//   const threadConfig = { configurable: { thread_id: "somdsfkle_id" } };
//   const stream = await graph.stream(
//     {
//       document: "",
//       action: "update",
//       messages: [],
//     },
//     threadConfig
//   );
//   for await (const chunk of stream) {
//     // console.log(chunk);
//   }
//   let humanText = "";
//   let stop = "";
//   while (true) {
//     await new Promise((resolve) => {
//       rl.question("What would you like to do with the document?", (answer) => {
//         humanText = answer;
//         resolve(answer);
//       });
//     });

//     for await (const chunk of await graph.stream(
//       new Command({ resume: { user_input: humanText } }),
//       threadConfig
//     )) {
//       const response = await chunk;
//       console.log(response);
//       if (response.root.action && response.root?.action === "save") {
//         stop = "save";
//       }
//     }
//     if (stop === "save") {
//       break;
//     }
//   }
//   rl.close();
// };
// main();

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const main = async () => {
//   const threadConfig = {
//     configurable: {
//       thread_id: "sdfsds8769we83dd",
//       shop_id: "687d0189002ff188ad59",
//     },
//   };
//   const GraphResponse = await graph.invoke(
//     {
//       action: "update",
//       messages: [],
//     },
//     threadConfig
//   );
//   //   console.log(response);

//   let humanText = "";
//   let stop = "";
//   while (true) {
//     await new Promise((resolve) => {
//       rl.question("Customer:", (answer) => {
//         humanText = answer;
//         resolve(answer);
//       });
//     });

//     await graph.invoke(
//       new Command({
//         resume: { user_input: humanText, messages: GraphResponse.messages },
//       }),
//       threadConfig
//     );
//     // console.log(response);
//     // if (response.action && response.action === "save") {
//     //   stop = "save";
//     // }

//     if (stop === "save") {
//       break;
//     }
//   }
//   rl.close();
// };
// main();
