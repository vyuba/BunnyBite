"use client";
import { motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import {
  CaretUpIcon,
  CheckCircleIcon,
  CircleDashedIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useEffect } from "react";
import { clientDatabase } from "@/app/lib/client-appwrite";
import { Models, Query } from "appwrite";
import { useUserStore } from "@/app/providers/userStoreProvider";

const setupStatus = [
  {
    icon: CircleDashedIcon,
    text: "Create a Twilio Account",
    description:
      "To begin, go to https://www.twilio.com and sign up for an account. Once you're in the dashboard, find the WhatsApp Sandbox. This is a testing environment that allows you to connect your WhatsApp number before going live. You'll be given a test number and a join code to use in the sandbox.",
    checked: true,
    tag: "create_twillio_acct",
  },
  {
    icon: CheckCircleIcon,
    text: "Connect Your WhatsApp Number to Twilio",
    description:
      "From the Twilio WhatsApp Sandbox section, follow the instructions to send a message (e.g., “join XYZ”) from your WhatsApp to the test number. This connects your personal WhatsApp so you can send and receive messages while testing the bot.",
    checked: false,
    tag: "whatsapp_number",
  },
  {
    icon: CheckCircleIcon,
    text: "Generate Your twillio API Keys",
    description:
      "In your Twilio dashboard, go to the API Keys, auth key and account siid keys section, and generate a new API key. This key allows the chatbot to securely identify and respond to your account's messages. Keep it safe — it's your access pass.",
    checked: false,
    tag: "twillio_Keys",
  },
  {
    icon: CheckCircleIcon,
    text: "Set Up the Webhook in Twilio",
    description:
      "In your Twilio dashboard, go to the Messaging > Sandbox Settings section. You'll find fields labeled “When a message comes in.” Paste your chatbot webhook URL there — it should look something like https://yourdomain.com/api/whatsapp/webhook. This lets Twilio forward incoming WhatsApp messages to your bot so it can respond.",
    checked: false,
    tag: "setup_webhook",
  },
  {
    icon: CheckCircleIcon,
    text: "Test the Chatbot in WhatsApp",
    description:
      "Now that everything is connected, try messaging the WhatsApp sandbox number from your phone. Type something like “Track my order.” The chatbot should respond by asking for your order ID. Reply with an example like #1234, and it should give you tracking info. This confirms that everything's working.",
    checked: false,
    tag: "whatsapp_number",
  },
  {
    icon: CheckCircleIcon,
    text: "You're All Set - Congratulations! 🎉",
    description:
      "That's it! Your AI-powered WhatsApp chatbot is now ready to assist customers with order tracking. You can sit back while the assistant handles the most common support requests instantly and efficiently. If you ever need help or want to add more features, you can always return to your dashboard.",
    checked: false,
    tag: "whatsapp_number",
  },
];

interface SetupProgress extends Models.Document {
  userId: string;
  completedSteps: number[];
}

const getSetupProgress = async (id: string) => {
  if (!id) throw new Error("No user id provided");
  try {
    const response = await clientDatabase.listDocuments(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_SETUPS_PROGRESS_COLLECTION_ID!,
      [Query.equal("userId", id)]
    );
    return response?.documents[0];
  } catch (error) {
    console.log(error);
  }
};

const AccountSetup = () => {
  const { user } = useUserStore((state) => state);
  const [isSetupsVisible, setIsSetupsVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [accountSetupStatus, setAccountSetupStatus] = useState(setupStatus);

  useEffect(() => {
    const fetchSetupProgress = async () => {
      const response = (await getSetupProgress(user?.$id)) as SetupProgress;
      console.log(response);
      const updatedSetupStatus = setupStatus.map((step) => ({
        ...step,
        checked: response?.[step.tag],
      }));
      setAccountSetupStatus(updatedSetupStatus);
      setActiveIndex(
        updatedSetupStatus.findIndex((step) => step.checked === false)
      );
    };
    fetchSetupProgress();
  }, [user]);

  return (
    <motion.span className="w-full text-black/70 dark:text-white h-full max-w-[796px] bg-tertiay-background mx-auto pt-3 px-1.5 rounded-lg border border-border">
      <div className="flex items-center pb-3 gap-1.5  px-1">
        <motion.svg
          className="-rotate-90 fill-none"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <circle
            className="fill-none stroke-border"
            cx="8"
            cy="8"
            r="6.5"
            strokeWidth="3"
          ></circle>
          <motion.circle
            initial={{
              strokeDashoffset:
                100 -
                (accountSetupStatus.filter((status) => status.checked)
                  .length === 0
                  ? 0
                  : (accountSetupStatus.filter((status) => status.checked)
                      .length *
                      100) /
                    accountSetupStatus.length),
            }}
            animate={{
              strokeDashoffset:
                100 -
                (accountSetupStatus.filter((status) => status.checked)
                  .length === 0
                  ? 0
                  : (accountSetupStatus.filter((status) => status.checked)
                      .length *
                      100) /
                    accountSetupStatus.length),
            }}
            style={{
              strokeLinecap: "round",
            }}
            className="stroke-[#1A1A1A] dark:stroke-primary-background  fill-none"
            cx="8"
            cy="8"
            r="6.5"
            strokeWidth="3"
            pathLength="100"
            strokeDasharray="100"
          ></motion.circle>
        </motion.svg>
        <h1 className="text-xs">
          {accountSetupStatus.filter((status) => status.checked).length} of{" "}
          {accountSetupStatus.length} tasks complete
        </h1>
      </div>
      <div className="w-full flex flex-col gap-1.5 overflow-hidden">
        {accountSetupStatus.map((status, index) => {
          const isActiveOpen = activeIndex === index;

          return (
            <motion.div
              initial={{
                backgroundColor:
                  activeIndex === index
                    ? "var(--primary-background)"
                    : "var(--primary-background-transparent",
                border:
                  activeIndex === index ? "1px solid var(--border)" : "none",
                display:
                  activeIndex === index
                    ? "block"
                    : isSetupsVisible
                    ? "none"
                    : "block",
                paddingBlock:
                  activeIndex === index ? "16px" : isSetupsVisible ? 0 : "16px",
              }}
              animate={{
                backgroundColor:
                  activeIndex === index
                    ? "var(--primary-background)"
                    : "var(--primary-background-transparent)",
                paddingBlock:
                  activeIndex === index ? "16px" : isSetupsVisible ? 0 : "16px",
                border:
                  activeIndex === index ? "1px solid var(--border)" : "none",
                display:
                  activeIndex === index
                    ? "block"
                    : isSetupsVisible
                    ? "none"
                    : "block",
              }}
              // whileHover={{
              //   backgroundColor: index === 0 ? undefined : "#f0efef",
              // }}
              key={index}
              className={`w-full ${
                !isActiveOpen && "hover:bg-[#f0efef]"
              } cursor-pointer px-4 overflow-hidden h-full rounded-lg`}
            >
              <motion.span
                onClick={() => {
                  setActiveIndex(index);
                }}
                initial={{
                  opacity:
                    activeIndex === index ? "1" : isSetupsVisible ? 0 : 1,
                  display:
                    activeIndex === index
                      ? "flex"
                      : isSetupsVisible
                      ? "none"
                      : "flex",
                  height:
                    activeIndex === index
                      ? "auto"
                      : isSetupsVisible
                      ? 0
                      : "auto",
                }}
                animate={{
                  opacity: activeIndex === index ? 1 : isSetupsVisible ? 0 : 1,
                  display:
                    activeIndex === index
                      ? "flex"
                      : isSetupsVisible
                      ? "none"
                      : "flex",
                  height:
                    activeIndex === index
                      ? "auto"
                      : isSetupsVisible
                      ? 0
                      : "auto",
                }}
                transition={{
                  duration: 0.3,
                  // delay: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                className="text-sm font-medium  items-center gap-1 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setAccountSetupStatus((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              checked: !item.checked,
                            }
                          : item
                      )
                    );
                  }}
                  className="cursor-pointer"
                >
                  {status.checked ? (
                    <CheckCircleIcon size={20} weight="fill" display={"none"} />
                  ) : (
                    <CircleDashedIcon size={20} weight="regular" />
                  )}
                </button>

                <p>{status.text}</p>
              </motion.span>
              <motion.div
                initial={{
                  height: activeIndex === index ? "auto" : 0,
                  paddingTop: activeIndex === index ? "8px" : 0,
                }}
                animate={{
                  height: activeIndex === index ? "auto" : 0,
                  paddingTop: activeIndex === index ? "8px" : 0,
                }}
                className="grid gap-2  overflow-hidden"
              >
                <p className="text-sm ">
                  <span>{status?.description}</span>
                </p>
                <div className="bg-tertiay-background gap-2 w-full py-2 rounded-md px-2 border border-border flex items-center justify-between">
                  <p className="text-xs md:text-sm">
                    Use this personalized guide to get your store up and
                    running.
                  </p>
                  <button
                    onClick={() => {
                      setAccountSetupStatus((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? {
                                ...item,
                                checked: true,
                              }
                            : item
                        )
                      );
                      if (!(index === accountSetupStatus.length - 1)) {
                        setActiveIndex(activeIndex + 1);
                      }
                    }}
                    className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-2 md:px-3 hover:cursor-pointer text-nowrap bg-white dark:bg-black/40 text-xs md:text-sm py-2 rounded-md"
                  >
                    next step
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <button
        onClick={() => setIsSetupsVisible(!isSetupsVisible)}
        className="px-1 py-3 w-full flex items-center text-black/70 dark:text-white justify-between cursor-pointer"
      >
        <span className="text-xs capitalize">view all</span>
        {!isSetupsVisible ? (
          <CaretUpIcon size={17} weight="regular" />
        ) : (
          <CaretDownIcon size={17} weight="regular" />
        )}
      </button>
    </motion.span>
  );
};

export default AccountSetup;
