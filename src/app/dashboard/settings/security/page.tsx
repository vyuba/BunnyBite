"use client";
import { useCounterStore } from "@/app/providers/counter-store-provider";
const SecurityPage = () => {
  const { shop } = useCounterStore((state) => state);
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-[#E3E3E3] px-3 pb-2">
            <h2 className="text-base">Privacy</h2>
            <p className="text-sm text-black/70">
              Info&apos;s on all the stores you have installed
            </p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    Twilio WhatsApp API Configuration
                  </span>
                  <button className="border w-fit border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg">
                    save
                  </button>
                </div>
                <label className="flex items-start w-full flex-col gap-1">
                  <span className="text-sm">ChatBot Whatsapp No</span>
                  <input
                    type="text"
                    className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-[#E3E3E3]"
                    defaultValue={shop?.shop_number}
                  />
                </label>
                <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
                  <label className="flex items-start w-full flex-col gap-1">
                    <span className="text-sm"> Auth Token</span>
                    <input
                      type="text"
                      className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-[#E3E3E3]"
                      defaultValue={"38-2740389-80870-0897"}
                    />
                  </label>
                  <label className="flex items-start w-full flex-col gap-1">
                    <span className="text-sm"> Account SID</span>
                    <input
                      type="text"
                      className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-[#E3E3E3]"
                      defaultValue={"38-2740389-98709-7698"}
                    />
                  </label>
                </div>
              </label>
            </div>
            {/* <div className="flex  w-full flex-col gap-2  pt-2 ">
                <label className="flex flex-col gap-1">
                  <span className="text-sm capitalize ">customthem</span>
                  <span className="text-sm text-black/70">
                    johnfre@gmail.com
                  </span>
                </label>
              </div> */}
          </div>
        </div>
        {/* <div className="flex flex-col border-t border-[#E3E3E3]">
            <div className="w-full border-b grid gap-1 border-[#E3E3E3] px-3 py-2">
              <h2 className="text-base">Twilio WhatsApp API Configuration</h2>
              <p className="text-sm  w-full text-black/70">
                Configure your Twilio WhatsApp API settings to enable BunnyBite
                to send WhatsApp messages.
              </p>
            </div>
            <div className="flex  w-full flex-col gap-2 px-3 pt-2 relative">
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute hover:bg-[#F7F7F7] p-1.5 rounded-sm cursor-pointer top-[10px] right-[10px]"
              >
                <PencilSimpleIcon size={17} />
              </button>
              <label className="flex flex-col  w-full gap-1">
                <span className="text-sm capitalize ">Phone Number</span>
                <span className="text-sm text-black/70">09161076598</span>
              </label>
              <div className="flex flex-wrap items-center justify-between  w-full gap-2">
                <label className="flex items-center gap-1">
                  <span className="text-sm"> Account SID:</span>
                  <span className="text-sm text-black/70">
                    083************************sk
                  </span>
                  <CopyIcon
                    size={17}
                    className="text-black/70 cursor-copy hover:text-black"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span className="text-sm"> Auth Token:</span>
                  <span className="text-sm text-black/70">
                    083************************sk
                  </span>
                </label>
              </div>
            </div>
          </div> */}
      </div>
    </>
  );
};

export default SecurityPage;
