import { BellIcon } from "@phosphor-icons/react";
import PopOver from "./Popover";
import Link from "next/link";
import { useState } from "react";
import NotificationContainer from "./NotificationContainer";

const AnouncementBanner = () => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  return (
    <div className="w-full h-14 bg-secondary-background text-black/70 dark:text-white  flex flex-row-reverse md:flex-row justify-between items-center">
      <div className="flex items-center gap-1 px-4">
        <p className="capitalize text-black/70 dark:text-white/70 text-sm font-medium hidden md:block">
          just 9 days on your advanced plan
        </p>
        <Link href={"/dashboard/settings/billing"}>
          <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-3 hover:cursor-pointer bg-background text-sm py-2 rounded-lg text-nowrap">
            manage plan
          </button>
        </Link>
        <div className="md:hidden">
          <PopOver
            isProfileClicked={isProfileClicked}
            setIsProfileClicked={setIsProfileClicked}
            icon={
              <BellIcon
                weight={`regular`}
                fill="var(--icon-background)"
                size={18}
              />
            }
          >
            <NotificationContainer
              setIsProfileClicked={setIsProfileClicked}
              isProfileClicked={isProfileClicked}
            />
          </PopOver>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-4">
        <p className="capitalize text-xs  md:text-sm text-black/70 dark:text-white ">
          continue configuring your profile
        </p>
        {/* <button className="cursor-pointer  px-3 py-3 bg-[var(--background)] hover:bg-[var(--background)] rounded-sm">
          <BellRingingIcon weight={`regular`} fill="#303030" size={20} />
        </button> */}
        <div className="hidden md:block">
          <PopOver
            isProfileClicked={isProfileClicked}
            setIsProfileClicked={setIsProfileClicked}
            icon={
              <BellIcon
                weight={`regular`}
                fill="var(--icon-background)"
                size={18}
              />
            }
          >
            <NotificationContainer
              setIsProfileClicked={setIsProfileClicked}
              isProfileClicked={isProfileClicked}
            />
          </PopOver>
        </div>
      </div>
    </div>
  );
};

export default AnouncementBanner;
