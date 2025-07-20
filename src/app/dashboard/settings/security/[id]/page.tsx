// "use client";

import { getShopDetails } from "@/utils";

// import { useCounterStore } from "@/app/providers/counter-store-provider";
const SecurityPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const shop = await getShopDetails(id);
  console.log(shop);
  return (
    <div className="flex  w-full flex-col gap-2 pt-2 text-black/70 dark:text-white">
      <label className="flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          <span className="capitalize text-sm md:text-base ">
            Twilio WhatsApp API Configuration
          </span>
          <button className="border w-fit border-border border-b-2  capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg">
            save
          </button>
        </div>
        <label className="flex items-start w-full flex-col gap-1 text-black/70 dark:text-white">
          <span className="text-sm">ChatBot Whatsapp No</span>
          <input
            type="text"
            className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-border"
            value={shop?.shop_number || "No Phone number"}
            readOnly
          />
        </label>
        <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
          <label className="flex items-start w-full flex-col gap-1">
            <span className="text-sm"> Auth Token</span>
            <input
              type="text"
              className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-border"
              value={shop?.twillio_auth_token || "No Key"}
              readOnly
            />
          </label>
          <label className="flex items-start w-full flex-col gap-1">
            <span className="text-sm">Account SID:</span>
            <input
              type="text"
              className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-border"
              value={shop?.twillio_account_siid || "No Key"}
              readOnly
            />
          </label>
        </div>
      </label>
    </div>
  );
};

export default SecurityPage;
