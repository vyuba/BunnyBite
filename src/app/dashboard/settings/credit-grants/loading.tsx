"use client";

import Skeleton from "@/components/Skeleton";

const Loading = () => {
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <Skeleton styling="h-5 w-28" /> {/* Title skeleton */}
            <Skeleton styling="h-4 w-40" /> {/* Subtitle skeleton */}
          </div>
          <div className="px-3">
            <div className="flex w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-3">
                <div className="w-full flex items-center justify-between">
                  <Skeleton styling="h-4 w-16" /> {/* "credits" label */}
                  <Skeleton styling="h-3 w-8" /> {/* "NGN" text */}
                </div>
                <div className="flex items-center w-full gap-4">
                  <Skeleton styling="w-full h-2 rounded-xs" />{" "}
                  {/* Progress bar */}
                  <Skeleton styling="h-4 w-24" /> {/* Credits amount */}
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
