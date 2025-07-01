import { BellIcon, GearIcon } from "@phosphor-icons/react";
import PopOver from "./Popover";
import Link from "next/link";
import { useState } from "react";

const AnouncementBanner = () => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  return (
    <div className="w-full h-14 bg-[#EBEBEB]  flex flex-row-reverse md:flex-row justify-between items-center">
      <div className="flex items-center gap-1 px-4">
        <p className="capitalize text-black/70 text-sm font-medium hidden md:block">
          just 9 days on your advanced plan
        </p>
        <Link href={"/dashboard/settings/billing"}>
          <button className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-3 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg">
            manage plan
          </button>
        </Link>
      </div>
      <div className="flex items-center gap-1.5 px-4">
        <p className="capitalize text-sm ">continue configuring your profile</p>
        {/* <button className="cursor-pointer  px-3 py-3 bg-[var(--background)] hover:bg-[var(--background)] rounded-sm">
          <BellRingingIcon weight={`regular`} fill="#303030" size={20} />
        </button> */}
        <PopOver
          isProfileClicked={isProfileClicked}
          setIsProfileClicked={setIsProfileClicked}
          icon={<BellIcon weight={`regular`} fill="#303030" size={18} />}
        >
          <div className="w-full h-[400px]">
            <span className=" p-3 w-full flex items-center justify-between">
              <p className=" text-sm md:text-base">Notifications</p>
              <Link
                onClick={() => setIsProfileClicked(!isProfileClicked)}
                href={"/dashboard/settings"}
              >
                <GearIcon weight={`regular`} fill="#303030" size={20} />
              </Link>
            </span>
            <ul className="w-full flex flex-col">
              <li className="w-full cursor-pointer hover:bg-[#f1f1f1] border-y text-xs md:text-sm border-[#E3E3E3] px-2 py-3">
                🎉 Welcome to BunnyBite Hope you have a wonderful time here
              </li>
            </ul>
          </div>
        </PopOver>
      </div>
    </div>
  );
};

export default AnouncementBanner;
