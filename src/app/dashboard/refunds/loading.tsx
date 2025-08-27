"use client";

import Skeleton from "@/components/Skeleton";

const RefundPageSkeleton = () => {
  return (
    <div className="w-full h-screen">
      <div className="w-full max-w-[996px] bg-primary-background mx-auto py-1.5 rounded-lg border border-border h-auto flex flex-col gap-1.5">
        {/* Search Bar Skeleton */}
        <div className="px-1.5 py-1 mx-1.5 flex items-center gap-1">
          <Skeleton styling="w-5 h-5 rounded-sm" />
          <Skeleton styling="w-full h-6 rounded-xs" />
        </div>

        {/* Table Skeleton */}
        <div className="w-full overflow-x-scroll">
          <table className="w-full bg-primary-background border-border">
            <thead>
              <tr className="bg-tertiay-background border-y border-border">
                {[
                  "Refund ID",
                  "Order ID",
                  "Customer",
                  "Date",
                  "Reason",
                  "Status",
                ].map((header, i) => (
                  <th key={i} className="text-left text-sm font-medium p-2">
                    <Skeleton styling="w-20 h-6 rounded-xs" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array(6)
                    .fill(null)
                    .map((_, j) => (
                      <td key={j} className="p-2">
                        <Skeleton styling="w-full h-6 rounded-xs" />
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Skeleton */}
        <div className="w-full py-2 px-3 flex items-center justify-between">
          <Skeleton styling="w-28 h-6 rounded-xs" />
          <div className="flex items-center gap-2">
            <Skeleton styling="w-6 h-6 rounded-xs" />
            <Skeleton styling="w-6 h-6 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPageSkeleton;
