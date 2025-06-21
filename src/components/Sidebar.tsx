"use client";
import {
  HouseIcon,
  ChatIcon,
  ShoppingBagIcon,
  GearIcon,
  UserCircleIcon,
  DoorOpenIcon,
  CaretUpDownIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { clientAccount } from "@/app/lib/client-appwrite";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { toast } from "sonner";

// import { signOut } from "@/helpers/appwrite-helpers";

export const SidebarLinks = [
  {
    title: "Dashboard",
    icon: HouseIcon,
    link: "/dashboard",
  },
  {
    title: "Chat",
    icon: ChatIcon,
    link: "/dashboard/chat",
  },
  {
    title: "Refunds",
    icon: ShoppingBagIcon,
    link: "/dashboard/refunds",
  },
];

const SidebarFooterLinks = [
  {
    title: "Settings",
    icon: GearIcon,
    link: "/dashboard/settings",
  },
];

export const SideBar = ({
  shop,
  user,
  pathname,
}: {
  shop: string | null;
  user: string | null;
  pathname: string;
}) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const router = useRouter();
  const { isSidebar } = useCounterStore((state) => state);
  const inputRef = useRef(null);
  const PopUpref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      event.stopPropagation();
      if (
        PopUpref.current &&
        inputRef.current &&
        !(PopUpref.current as HTMLElement).contains(event.target as Node) &&
        !(inputRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsProfileClicked(!isProfileClicked);
      }
    }
    if (isProfileClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileClicked]);

  //SIGN OUT USER
  async function signOut() {
    toast.loading("Signing out...", {
      id: "sign-out",
    });
    try {
      await clientAccount.deleteSession("current");
      router.push("/login");
      toast.success("Signed out successfully", {
        id: "sign-out",
      });
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out", {
        id: "sign-out",
      });
    }
    toast.dismiss("sign-out");
  }

  return (
    <motion.div
      initial={{ width: isSidebar ? 0 : "auto" }}
      animate={{ width: isSidebar ? 0 : "auto" }}
      transition={{
        type: "tween",
        stiffness: 100,
        damping: 0,
      }}
      exit={{ width: 0 }}
      className={`  md:w-fit overflow-hidden flex transition-all flex-col justify-between h-screen bg-[#EBEBEB] `}
    >
      <ul className="flex flex-col gap-3 px-3 mt-3">
        <div className="border hover:cursor-pointer size-10 border-[#4A4A4A] hover:border-b-2 transition-[border] text-black/70 capitalize px-3 bg-[#303030] text-sm py-2 rounded-lg" />
        {SidebarLinks.map((link, index) => (
          <Link
            className="flex items-center gap-2"
            href={link.link}
            key={index}
          >
            <div
              className={` ${
                link.link == pathname
                  ? " border-[#E3E3E3] hover:border-b-2 bg-[var(--background)]"
                  : "hover:border-[var(--background)] hover:bg-[var(--background)]"
              } border border-[#EBEBEB] transition-all flex items-center justify-center hover:cursor-pointer  text-black/70 capitalize px-3  text-sm py-3 rounded-lg`}
            >
              <link.icon
                weight={`${link.link == pathname ? "fill" : "regular"}`}
                fill="#303030"
                size={20}
              />
            </div>
          </Link>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 px-3 mb-4">
        {SidebarFooterLinks.map((link, index) => (
          <Link
            className="flex items-center gap-2"
            href={link.link}
            key={index}
          >
            <div
              className={` ${
                link.link == pathname
                  ? " bg-[var(--background)]"
                  : "hover:bg-[var(--background)]"
              }  transition-all flex items-center justify-center hover:cursor-pointer text-black/70 capitalize px-3  text-sm py-3 rounded-lg`}
            >
              <link.icon
                weight={`${link.link == pathname ? "fill" : "regular"}`}
                fill="#303030"
                size={20}
              />
            </div>
          </Link>
        ))}
        <button
          onClick={() => setIsProfileClicked(!isProfileClicked)}
          ref={inputRef}
          className={`${
            isProfileClicked
              ? " bg-[var(--background)]"
              : "hover:bg-[var(--background)]"
          }  transition-all flex items-center justify-center hover:cursor-pointer text-black/70 capitalize px-3  text-sm py-3 rounded-lg`}
        >
          <UserCircleIcon
            weight={`${isProfileClicked ? "fill" : "regular"}`}
            fill="#303030"
            size={20}
          />
        </button>
      </ul>
      <motion.div
        ref={PopUpref}
        initial={{ y: 100, x: -100, opacity: 0, scale: 0 }}
        animate={{
          y: isProfileClicked ? 0 : 100,
          x: isProfileClicked ? 40 : -100,
          opacity: isProfileClicked ? 1 : 0,
          scale: isProfileClicked ? 1 : 0,
        }}
        exit={{ y: 100, x: -100, opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-10 z-50 left-10 rounded-md bg-[#EBEBEB] border border-[#E3E3E3] px-1 pb-1 max-w-[240px]"
      >
        <button className="cursor-pointer w-full flex items-center gap-1 py-1 hover:bg-white rounded-sm px-1 my-1.5">
          <div className="size-7 rounded-sm bg-[#303030]" />
          <span className="text-xs">{shop}</span>
          <CaretUpDownIcon size={18} />
        </button>
        <div className="bg-white text-sm w-full rounded-sm flex flex-col py-1 px-1 gap-2">
          <span className=" px-2">{user}</span>
          <button className="flex items-center w-full justify-start cursor-pointer gap-1 transition-all hover:bg-[#EBEBEB] rounded-sm p-1">
            <UserCircleIcon weight="fill" fill="#303030" size={15} />
            <span>Account</span>
          </button>
          <button
            onClick={signOut}
            className="flex items-center w-full justify-start cursor-pointer gap-1 transition-all hover:bg-[#EBEBEB] rounded-sm p-1"
          >
            <DoorOpenIcon weight="fill" fill="#303030" size={15} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
