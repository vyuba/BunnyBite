// import { fetchShop } from "@/helpers/shopifyQuery";
import { Instrument_Serif } from "next/font/google";
// import { HouseIcon } from "@phosphor-icons/react";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const Instrument = Instrument_Serif({
  style: "italic",
  weight: "400",
  subsets: ["latin"],
});

export default async function Home() {
  return (
    <div className={`w-full h-full md:h-screen p-2 `}>
      <div className="w-full overflow-hidden relative h-full px-2 pb-2 pt-30 lg:pt-0 flex-col flex items-center justify-center bg-background border border-border rounded-lg">
        <Navbar />
        <Image
          src={"/shopifybox.svg"}
          width={100}
          height={100}
          alt="BunnyBite Logo"
          className="absolute top-60 -left-5 md:left-20 size-[65px] lg:size-[144px]"
        />
        <Image
          src={"/whatsappbox.svg"}
          width={100}
          height={100}
          alt="BunnyBite Logo"
          className="absolute top-16 md:top-20 -right-5 md:right-40 size-[65px] lg:size-[144px]"
        />
        <div className="flex flex-col pb-15 items-center gap-5 ">
          <div className="text-center">
            <h1
              className={`capitalize text-[clamp(28px,5vw,72px)]  pb-3 md:pb-0 text-black/70 dark:text-white `}
            >
              customer service {""}
              <strong
                className={`text-[clamp(33px,5vw,80px)] text-black/70 dark:text-white ${Instrument.className}`}
              >
                Chatbot
              </strong>
            </h1>
            <h2 className="capitalize text-[clamp(13px,1vw,20px)] text-black/70 dark:text-white">
              all you have to do is install it on your shopify store and ai
              handles the rest
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-4 hover:cursor-pointer bg-primary-background text-sm md:text-base py-2 rounded-lg">
                Install app
              </button>
            </Link>
            <Link href="/login">
              <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-4 hover:cursor-pointer bg-primary-background text-sm md:text-base py-2 rounded-lg">
                sign in
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full max-w-[800px] bg-primary-background border border-border h-[400px] rounded-lg" />
      </div>
    </div>
  );
}
// border-r border-border
