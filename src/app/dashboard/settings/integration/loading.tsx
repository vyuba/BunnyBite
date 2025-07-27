"use client";

import Skeleton from "@/components/Skeleton";

const Loading = () => {
  return (
    <>
      <div className="grid gap-3 py-3 w-full text-black/70 dark:text-white">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <Skeleton styling="h-5 w-20" /> {/* Title */}
            <Skeleton styling="h-4 w-48" /> {/* Subtitle */}
          </div>
          <div className="px-3">
            <div className="flex w-full flex-col gap-2 pt-2 overflow-hidden">
              <label className="flex flex-col gap-1 overflow-hidden">
                <div className="w-full flex items-center justify-between">
                  <Skeleton styling="h-4 w-28" /> {/* manage integration */}
                  <Skeleton styling="h-8 w-32 rounded-lg" />{" "}
                  {/* connect new store button */}
                </div>

                {/* Simulate connect form */}
                <div className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5">
                  <label className="flex items-start w-full flex-col gap-1">
                    <Skeleton styling="h-4 w-16" /> {/* Connect label */}
                    <Skeleton styling="h-8 w-full max-w-[400px] rounded-md" />{" "}
                    {/* Input field */}
                  </label>
                  <Skeleton styling="h-8 w-20 rounded-lg" /> {/* Save button */}
                </div>

                {/* Simulated list of user shops */}
                <div className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5 mt-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-full flex flex-row items-end flex-1 gap-2"
                    >
                      <label className="flex items-start w-full flex-col gap-1">
                        <Skeleton styling="h-4 w-20" /> {/* Shopify label */}
                        <Skeleton styling="h-8 w-full max-w-[400px] rounded-md" />{" "}
                        {/* Input field */}
                      </label>
                      <div className="flex items-center gap-0.5">
                        <Skeleton styling="h-8 w-8 rounded-lg" />{" "}
                        {/* Edit button */}
                        <Skeleton styling="h-8 w-8 rounded-lg" />{" "}
                        {/* Delete button */}
                      </div>
                    </div>
                  ))}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Loading;
