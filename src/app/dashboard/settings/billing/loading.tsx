"use client";

import Skeleton from "@/components/Skeleton";

const Loading = () => {
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <Skeleton styling="h-5 w-24" /> {/* Overview title */}
            <Skeleton styling="h-4 w-40" /> {/* Subtitle */}
          </div>

          {/* Manage Plan */}
          <div className="px-3">
            <div className="flex w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <Skeleton styling="h-4 w-28" /> {/* manage plan */}
                  <Skeleton styling="h-8 w-28 rounded-lg" />{" "}
                  {/* change plan button */}
                </div>
                <div className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5">
                  <label className="flex items-start w-full flex-col gap-1">
                    <Skeleton styling="h-4 w-32" /> {/* Billing Information */}
                    <Skeleton styling="h-8 w-full max-w-[400px] rounded-md" />{" "}
                    {/* Input */}
                  </label>
                  <Skeleton styling="h-8 w-16 rounded-lg" /> {/* edit button */}
                </div>
              </label>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-3 mt-3 border-t border-border">
            <div className="flex w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <Skeleton styling="h-4 w-36" /> {/* Payment methods */}
                  <Skeleton styling="h-8 w-28 rounded-lg" />{" "}
                  {/* add method button */}
                </div>

                {/* Cards */}
                <div className="w-full flex flex-col md:flex-row gap-1.5 pt-1">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-tertiay-background border border-border rounded-md max-w-[375px] py-2 px-3 grid gap-1.5 w-full text-xs md:text-sm"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-2 w-full">
                          <Skeleton styling="size-8 rounded-sm" />{" "}
                          {/* Card icon */}
                          <span className="flex flex-col gap-0.5 items-start w-full">
                            <Skeleton styling="h-4 w-20" /> {/* ****2612 */}
                            <Skeleton styling="h-3 w-24" /> {/* Expires date */}
                          </span>
                        </div>
                        {i === 1 ? (
                          <Skeleton styling="h-5 w-16 rounded-sm" /> /* Default badge */
                        ) : null}
                      </div>
                      <div className="w-full flex items-center gap-3">
                        <Skeleton styling="h-4 w-14" /> {/* delete button */}
                        {i === 2 && <Skeleton styling="h-4 w-24" />}{" "}
                        {/* set as default */}
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
