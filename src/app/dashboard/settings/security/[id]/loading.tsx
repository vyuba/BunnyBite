"use client";

import Skeleton from "@/components/Skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-2 pt-2 text-black/70 dark:text-white">
        <label className="flex flex-col gap-1">
          <div className="w-full flex items-center justify-between">
            <Skeleton styling="h-4 w-60" />{" "}
            {/* Twilio WhatsApp API Configuration */}
            <Skeleton styling="h-8 w-20 rounded-lg" /> {/* Save button */}
          </div>

          {/* ChatBot Whatsapp No */}
          <label className="flex items-start w-full flex-col gap-1">
            <Skeleton styling="h-4 w-32" /> {/* ChatBot Whatsapp No label */}
            <Skeleton styling="h-8 w-full rounded-md" /> {/* Input field */}
          </label>

          {/* Auth Token and Account SID */}
          <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
            <label className="flex items-start w-full flex-col gap-1">
              <Skeleton styling="h-4 w-24" /> {/* Auth Token label */}
              <Skeleton styling="h-8 w-full rounded-md" />{" "}
              {/* Auth Token input */}
            </label>
            <label className="flex items-start w-full flex-col gap-1">
              <Skeleton styling="h-4 w-28" /> {/* Account SID label */}
              <Skeleton styling="h-8 w-full rounded-md" />{" "}
              {/* Account SID input */}
            </label>
          </div>
        </label>
      </div>
    </>
  );
};

export default Loading;
