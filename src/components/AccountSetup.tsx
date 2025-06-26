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
import { useCounterStore } from "@/app/providers/counter-store-provider";

const setupStatus = [
  {
    icon: CircleDashedIcon,
    text: "Setup guide 1: Create a Twilio Account",
    description:
      "To begin, go to <a className='text-[#0077CC]' href='https://www.twilio.com/'> twilio.com </a> and sign up for an account. Once you're in the dashboard, find the WhatsApp Sandbox. This is a testing environment that allows you to connect your WhatsApp number before going live. You'll be given a test number and a join code to use in the sandbox.",
    checked: true,
  },
  {
    icon: CheckCircleIcon,
    text: "Connect Your WhatsApp Number to Twilio",
    description:
      "From the Twilio WhatsApp Sandbox section, follow the instructions to send a message (e.g., “join XYZ”) from your WhatsApp to the test number. This connects your personal WhatsApp so you can send and receive messages while testing the bot.",
    checked: false,
  },
  {
    icon: CheckCircleIcon,
    text: "Generate Your API Key",
    description:
      "Log into your chatbot dashboard (from our app), go to Settings, then click on API Key. Press “Generate New Key” and copy it. This key allows the chatbot to securely identify and respond to your account's messages. Keep it safe — it's your access pass.",
    checked: false,
  },
  {
    icon: CheckCircleIcon,
    text: "Set Up the Webhook in Twilio",
    description:
      "In your Twilio dashboard, go to the Messaging > Sandbox Settings section. You'll find fields labeled “When a message comes in.” Paste your chatbot webhook URL there — it should look something like https://yourdomain.com/api/whatsapp/webhook. This lets Twilio forward incoming WhatsApp messages to your bot so it can respond.",
    checked: false,
  },
  {
    icon: CheckCircleIcon,
    text: "Test the Chatbot in WhatsApp",
    description:
      "Now that everything is connected, try messaging the WhatsApp sandbox number from your phone. Type something like “Track my order.” The chatbot should respond by asking for your order ID. Reply with an example like #1234, and it should give you tracking info. This confirms that everything's working.",
    checked: false,
  },
  {
    icon: CheckCircleIcon,
    text: "You're All Set - Congratulations! 🎉",
    description:
      "That's it! Your AI-powered WhatsApp chatbot is now ready to assist customers with order tracking. You can sit back while the assistant handles the most common support requests instantly and efficiently. If you ever need help or want to add more features, you can always return to your dashboard.",
    checked: false,
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
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID || "683b2cfa00237042d186",
      process.env.APPWRITE_USER_SETUPS_PROGRESS_COLLECTION_ID ||
        "68574c5a000318663290",
      [Query.equal("userId", id)]
    );
    return response?.documents[0];
  } catch (error) {
    console.log(error);
  }
};

const AccountSetup = () => {
  const { user } = useCounterStore((state) => state);
  const [isSetupsVisible, setIsSetupsVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [accountSetupStatus, setAccountSetupStatus] = useState(setupStatus);

  useEffect(() => {
    const fetchSetupProgress = async () => {
      const response = (await getSetupProgress(user?.$id)) as SetupProgress;
      console.log(response);
      const updatedSetupStatus = setupStatus.map((step, index) => ({
        ...step,
        checked: response?.completedSteps?.includes(index),
      }));
      setAccountSetupStatus(updatedSetupStatus);
      setActiveIndex(response?.completedSteps.at(-1));
    };
    fetchSetupProgress();
  }, [user]);

  return (
    <motion.span className="w-full max-w-[796px] bg-[#F7F7F7] mx-auto py-3 px-1.5 rounded-lg border border-[#E3E3E3] ">
      <div className="flex items-center pb-3 gap-1.5  px-1">
        <motion.svg
          className="-rotate-90 fill-none"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <circle
            className="fill-none stroke-[#E3E3E3]"
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
            className="stroke-[#1A1A1A] fill-none"
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
                  activeIndex === index ? "white" : "transparent",
                border: activeIndex === index ? "1px solid #E3E3E3" : "none",
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
                  activeIndex === index ? "white" : "transparent",
                paddingBlock:
                  activeIndex === index ? "16px" : isSetupsVisible ? 0 : "16px",
                border: activeIndex === index ? "1px solid #E3E3E3" : "none",
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
                  <span
                    dangerouslySetInnerHTML={{ __html: status.description }}
                  />
                </p>
                <div className="bg-[#F7F7F7] gap-2 w-full py-2 rounded-md px-2 border border-[#E3E3E3] flex items-center justify-between">
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
                    className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2 md:px-3 hover:cursor-pointer bg-white text-xs md:text-sm py-2 rounded-md"
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
        className="px-1 pt-3 w-full flex items-center justify-between cursor-pointer"
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

// <div className="w-full p-4 bg-white h-full rounded-lg border border-[#E3E3E3] ">
//   <div className=" grid gap-2">
//     <h1 className="text-sm font-medium">
//       Setup guide 1: Create a Twilio Account
//     </h1>
//     <p className="text-sm">
//       To begin, go to{" "}
//       <a className="text-[#0077CC]" href="https://www.twilio.com/">
//         twilio.com
//       </a>{" "}
//       and sign up for an account. Once you&apos;re in the dashboard,
//       find the WhatsApp Sandbox. This is a testing environment that
//       allows you to connect your WhatsApp number before going live.
//       You&apos;ll be given a test number and a join code to link your
//       own WhatsApp to the sandbox.
//     </p>
//   </div>
//   <div className="bg-[#F7F7F7] mt-3 gap-2 w-full py-2 rounded-md px-2 border border-[#E3E3E3] flex items-center justify-between">
//     <p className="text-xs md:text-sm">
//       Use this personalized guide to get your store up and running.
//     </p>
//     <button className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2 md:px-3 hover:cursor-pointer bg-white text-xs md:text-sm py-2 rounded-md">
//       next step
//     </button>
//   </div>
// </div>;

// <motion.div className="w-full cursor-pointer p-4 hover:bg-[#f0efef] h-full rounded-lg">
//   <span className="text-sm font-medium flex items-center gap-1">
//     <CircleDashedIcon size={20} weight="regular" />
//     {/* <CheckCircleIcon size={20} weight="fill" display={"none"} /> */}
//     <p>Connect Your WhatsApp Number to Twilio</p>
//   </span>
//   <motion.div
//     initial={{ height: 0, paddingTop: 0 }}
//     animate={{ height: 0 }}
//     className="grid gap-2  overflow-hidden"
//   >
//     <p className="text-sm ">
//       From the Twilio WhatsApp Sandbox section, follow the instructions
//       to send a message (e.g., “join XYZ”) from your WhatsApp to the
//       test number. This connects your personal WhatsApp so you can send
//       and receive messages while testing the bot.
//     </p>
//     <div className="bg-[#F7F7F7] gap-2 w-full py-2 rounded-md px-2 border border-[#E3E3E3] flex items-center justify-between">
//       <p className="text-xs md:text-sm">
//         Use this personalized guide to get your store up and running.
//       </p>
//       <button className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2 md:px-3 hover:cursor-pointer bg-white text-xs md:text-sm py-2 rounded-md">
//         next step
//       </button>
//     </div>
//   </motion.div>
// </motion.div>;
