import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
import "../../envConfig";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { END, interrupt, MemorySaver } from "@langchain/langgraph";
import { clientDatabase } from "@/app/lib/client-appwrite";
import {
  Annotation,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import {
  AIMessage,
  HumanMessage,
  // SystemMessage,
} from "@langchain/core/messages";

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

const saveRefund = tool(
  async ({ name, id, reason }) => {
    console.log("--CALLING-THE-REFUND-FUNCTION--");
    if (!name || !id || !reason) {
      throw new Error("Provide all the fields");
    }
    try {
      const refund = await clientDatabase.createDocument(
        "683b2cfa00237042d186",
        "683b2de000309d5417cf",
        ID.unique(),
        {
          isActive: true,
          user_name: name,
          details: reason,
        }
      );
      console.log(refund);
    } catch (error) {
      console.log(error);
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

const trackingOrder = tool(
  async ({ orderId }): Promise<OrderByIdentifierResponse> => {
    console.log("--CALLING-THE-GET-TRACKING-FUNCTION--");

    if (!orderId) {
      throw new Error("Provide all the fields");
    }

    try {
      const response = await fetch(
        `https://bunny-bite.vercel.app/api/shopify/getOrder?orderId=${orderId}&shop=customthem.myshopify.com`,
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

const outputSchema = z.object({
  action: z
    .enum(["save", "update"])
    .describe(
      "The action to perform, either 'save' or 'update', but the deafault is update"
    ),
  content: z.string().describe("This is where you put in your response"),
});

// Create the model
const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  // temperature: 0,
  apiKey:
    process.env.OPENAI_API_KEY ||
    "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",
});

const agent = createReactAgent({
  llm,
  prompt: SYSTEM_PROMPT,
  tools: [saveRefund, trackingOrder],
  responseFormat: outputSchema,
});
// .withStructuredOutput(zodToJsonSchema(outputSchema))
// .bindTools(tools);

const State = Annotation.Root({
  ...MessagesAnnotation.spec,
  action: Annotation<"save" | "update">,
  some_text: Annotation<string>,
  output: Annotation<string>,
});
// import readline from "readline";
import { tool } from "@langchain/core/tools";
import { ID } from "appwrite";

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// import { StructuredOutputParser } from "@langchain/core/output_parsers";
const myNode = async (state: typeof State.State) => {
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
      user_message = new HumanMessage({ content: value.user_input });
    }
  }
  // const allMessages = [
  //   new SystemMessage({ content: SYSTEM_PROMPT }),
  //   ...state.messages,
  //   user_message,
  // ];
  const response = await agent.invoke({
    messages: [...state.messages, user_message],
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

// const refundNode = async (state: typeof State.State) => {
//   const SYSTEM_PROMPT = `
// You are a helpful customer support agent who only assists with refund requests.

// - If the customer is asking about something other than a refund, kindly let them know that you can only handle refund-related issues.

// - If it's a refund request, ask the customer to provide:
//   - Their full name
//   - Order ID
//   - A brief description of the issue

// - After they provide these details, summarize the refund request and ask:
//   "Is everything correct and would you like to proceed with the refund request?"
// -If the user wants to save and finish, make sure to set the action to 'save'.

// - Only proceed if the customer confirms.
// `;
//   const refundNodeResponse = await llm.invoke([
//     ...state.messages,
//     new SystemMessage({ content: SYSTEM_PROMPT }),
//   ]);

//   return {
//     messages: [new AIMessage({ content: refundNodeResponse.content })],
//     action: refundNodeResponse.action,
//   };
// };

const routingFunction = async (state: typeof State.State) => {
  if (state.action === "save") {
    return "end";
  }
  return "root";
};

// const myNode2 = async (state: typeof State.State) => {};

const checkpointer = new MemorySaver();
export const graph = new StateGraph(State)
  .addNode("root", myNode)
  //   .addNode("root2", myNode2)
  .addEdge("__start__", "root")
  .addConditionalEdges("root", routingFunction, {
    end: END,
    root: "root",
  })
  .compile({ checkpointer });
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

// const main = async () => {
//   const threadConfig = { configurable: { thread_id: "somdsfkle_id" } };
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

//     const response = await graph.invoke(
//       new Command({
//         resume: { user_input: humanText, messages: GraphResponse.messages },
//       }),
//       threadConfig
//     );
//     // console.log(response);
//     if (response.action && response.action === "save") {
//       stop = "save";
//     }

//     if (stop === "save") {
//       break;
//     }
//   }
//   rl.close();
// };
// // main();
