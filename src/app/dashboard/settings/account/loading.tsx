"use client";

import Skeleton from "@/components/Skeleton";

const Loading = () => {
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <Skeleton styling="h-5 w-24" /> {/* General title */}
            <Skeleton styling="h-4 w-64" /> {/* Subtitle line 1 */}
            <Skeleton styling="h-4 w-56" /> {/* Subtitle line 2 */}
          </div>

          {/* Profile */}
          <div className="px-3">
            <div className="flex w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <Skeleton styling="h-4 w-16" /> {/* Profile text */}
                  <Skeleton styling="h-8 w-20 rounded-lg" /> {/* Save button */}
                </div>
                <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
                  <Skeleton styling="h-8 w-full rounded-md" />{" "}
                  {/* Name input */}
                  <Skeleton styling="h-8 w-full rounded-md" />{" "}
                  {/* Email input */}
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
