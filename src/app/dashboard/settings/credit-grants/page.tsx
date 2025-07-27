"use client";

import { useUserStore } from "@/app/providers/userStoreProvider";

const CreditPage = () => {
  const { shop } = useUserStore((state) => state);
  console.log(shop);
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <h2 className="text-base">Credit Grants</h2>
            <p className="text-sm">Info on your credit used</p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-3">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    credits
                  </span>
                  <span className="text-xs md:text-sm text-black/70 dark:text-white/70">
                    NGN
                  </span>
                </div>
                <div className="flex items-center w-full gap-4">
                  <div
                    id="credits-progress"
                    className="w-full h-2 rounded-xs border border-border overflow-hidden"
                  >
                    <div
                      style={{
                        width: `${
                          (shop?.tokensUsed / shop?.tokensFunded) * 100
                        }%`,
                      }}
                      className={`bg-secondary-background h-full`}
                    />
                  </div>
                  <span className="text-nowrap">
                    ₦{shop?.tokensUsed * 0.1} / ₦ {shop?.tokensFunded * 0.1}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreditPage;
