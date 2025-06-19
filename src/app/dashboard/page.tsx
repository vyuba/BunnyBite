// import { clientDatabase } from "../lib/client-appwrite";
"use client";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
// import { fetchShop } from "@/helpers/shopifyQuery";
// import { useCounterStore } from "../providers/counter-store-provider";
// import { useEffect, useState } from "react";
// import { createMessage } from "../lib/twillio";

export default function Home() {
  // const { shop } = useCounterStore((state) => state);
  // const [shopName, setShopName] = useState<string>("");

  // useEffect(() => {
  //   if (!shop) {
  //     return;
  //   }
  //   const fetchShopData = async () => {
  //     const data = await fetchShop({ shop: shop?.shop });
  //     console.log(data);
  //     setShopName(data?.shop?.name);
  //   };
  //   fetchShopData();
  //   // createMessage();
  // }, [shop]);
  // const getUserShops = async () => {
  //   try {
  //     clientDatabase.listDocuments(
  //       process.env.APPWRITE_DATABASE_ID as string,
  //       process.env.APPWRITE_COLLECTION_ID as string,
  //       [Query.equal("user", clientAccount.get().$id)]
  //     );
  //   } catch (error) {}
  // };
  return (
    <div className="flex gap-5 flex-col">
      <div className="w-full flex flex-col">
        {/* The steps container  */}
        <span className="w-full max-w-[796px] bg-[#F7F7F7] mx-auto py-3 px-1.5 rounded-lg border border-[#E3E3E3] ">
          <div className="flex items-center pb-3 gap-1.5  px-1">
            <svg
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
              <circle
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
                strokeDashoffset="60"
              ></circle>
            </svg>
            <h1 className="text-xs">1 of 2 tasks complete</h1>
          </div>
          <div className="w-full p-4 bg-white h-full rounded-lg border border-[#E3E3E3] ">
            <div className=" grid gap-2">
              <h1 className="text-sm font-medium">Setup guide</h1>
              <p className="text-sm">Get Your WhatsApp API Credentials.</p>
            </div>
            <div className="bg-[#F7F7F7] mt-3 gap-2 w-full py-2 rounded-md px-2 border border-[#E3E3E3] flex items-center justify-between">
              <p className="text-xs md:text-sm">
                Use this personalized guide to get your store up and running.
              </p>
              <button className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2 md:px-3 hover:cursor-pointer bg-white text-xs md:text-sm py-2 rounded-md">
                next step
              </button>
            </div>
          </div>
          <button className="px-1 pt-3 w-full flex items-center justify-between cursor-pointer">
            <span className="text-xs capitalize">view all</span>
            <CaretDownIcon size={17} weight="regular" />
          </button>
        </span>
      </div>
    </div>
  );
}
// border-r border-[#E3E3E3]
