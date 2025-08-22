"use client";
import {
  HouseIcon,
  ChatIcon,
  ShoppingBagIcon,
  GearIcon,
  UserCircleIcon,
  DoorOpenIcon,
  CaretUpDownIcon,
  StorefrontIcon,
  SunIcon,
  CircleHalfIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { clientAccount } from "@/app/lib/client-appwrite";
import { useUserStore } from "@/app/providers/userStoreProvider";
import { toast } from "sonner";
import ToolKit from "./ToolKit";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MoonIcon } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "@/app/providers/ThemeProvider";
// import { signOut } from "@/helpers/appwrite-helpers";
import { getProfileIcon } from "@/client-utils";
const SideBarLinks = {
  DashboardLinks: [
    {
      id: 1,
      title: "Dashboard",
      icon: HouseIcon,
      link: "/dashboard",
    },
    {
      id: 2,
      title: "Chat",
      icon: ChatIcon,
      link: "/dashboard/chat",
    },
    {
      id: 3,
      title: "Refunds",
      icon: ShoppingBagIcon,
      link: "/dashboard/refunds",
    },
  ],
  SidebarFooterLinks: [
    {
      id: 4,
      title: "Settings",
      icon: GearIcon,
      link: "/dashboard/settings",
    },
  ],
};

export const SideBar = ({ user }: { user: string | null }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const router = useRouter();
  const { isSidebar, setSidebar, userShops, shop, setActiveShop } =
    useUserStore((state) => state);
  const inputRef = useRef(null);
  const PopUpref = useRef(null);
  const [isToolKit, setToolKit] = useState(false);
  const [isHovered, setHovered] = useState(null);

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

  console.log(userShops);
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
      className={`fixed md:static top-0 left-0 ${
        !isSidebar
          ? "-translate-x-[100%] md:translate-x-0"
          : "translate-x-[0] md:translate-x-0"
      } z-[2000] w-full border border-border  md:border-0  md:static md:w-fit  flex transition-all flex-col justify-between h-dvh bg-secondary-background `}
    >
      <ul className="flex flex-col gap-3 px-3 mt-3">
        <div className="border hover:cursor-pointer size-10 border-[#4A4A4A] hover:border-b-2 transition-[border] text-black/70 capitalize  bg-[#303030] flex items-center justify-center text-sm  rounded-lg">
          <Image
            width={40}
            height={40}
            src={"/bunnyBite-logo.svg"}
            alt="BunnyBite Logo"
            className="p-1"
          />
        </div>
        {SideBarLinks["DashboardLinks"].map((link, index) => (
          <Link
            className="flex items-center gap-2"
            href={link.link}
            key={index}
            onClick={() => setSidebar(!isSidebar)}
          >
            <motion.div
              onMouseEnter={() => {
                setToolKit(true);
                setHovered(link.id);
              }}
              onMouseLeave={() => {
                setToolKit(false);
                setHovered(null);
              }}
              className={` ${
                link.link === pathname
                  ? " border-border hover:border-b-2 bg-[var(--background)]"
                  : "hover:border-[var(--background)] hover:bg-[var(--background)]"
              } border border-border transition-all flex items-center justify-center hover:cursor-pointer  text-black/70 capitalize px-3  text-sm py-3 rounded-lg`}
            >
              <link.icon
                weight={`${
                  link.link === pathname ||
                  (link.link === "/dashboard/chat" &&
                    pathname.includes(link.link))
                    ? "fill"
                    : "regular"
                }`}
                fill="var(--icon-background)"
                size={20}
              />
              <ToolKit
                isToolKit={isToolKit}
                isHovered={isHovered}
                index={link.id}
              >
                {link.title}
              </ToolKit>
            </motion.div>
            <p
              className={` md:hidden ${
                link.link === pathname ||
                (link.link === "/dashboard/chat" &&
                  pathname.includes(link.link))
                  ? "text-icon"
                  : "text-black/70 dark:text-white"
              }`}
            >
              {link.title}
            </p>
          </Link>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 px-3 mb-4">
        {SideBarLinks["SidebarFooterLinks"].map((link, index) => (
          <Link
            className="flex items-center gap-2"
            href={link.link + "/account"}
            key={index}
            onClick={() => setSidebar(!isSidebar)}
          >
            <div
              onMouseEnter={() => {
                setToolKit(true);
                setHovered(link.id);
              }}
              onMouseLeave={() => {
                setToolKit(false);
                setHovered(null);
              }}
              className={` ${
                pathname.includes(link.link)
                  ? " bg-[var(--background)]"
                  : "hover:bg-[var(--background)]"
              }  transition-all flex items-center justify-center hover:cursor-pointer text-black/70 capitalize px-3  text-sm py-3 rounded-lg`}
            >
              <link.icon
                weight={`${pathname.includes(link.link) ? "fill" : "regular"}`}
                fill="var(--icon-background)"
                size={20}
              />
              <ToolKit
                isToolKit={isToolKit}
                isHovered={isHovered}
                index={link.id}
              >
                {link.title}
              </ToolKit>
            </div>
            <p
              className={` md:hidden ${
                pathname.includes(link.link)
                  ? "text-icon"
                  : "text-black/70 dark:text-white"
              }`}
            >
              {link.title}
            </p>
          </Link>
        ))}
        <div
          onClick={() => setIsProfileClicked(!isProfileClicked)}
          ref={inputRef}
          className="flex items-center gap-2"
        >
          <button
            className={`${
              isProfileClicked
                ? " bg-[var(--background)]"
                : "hover:bg-[var(--background)]"
            }  transition-all flex items-center justify-center w-fit hover:cursor-pointer text-black/70 dark:text-white capitalize px-3  text-sm py-3 rounded-lg`}
          >
            <UserCircleIcon
              weight={`${isProfileClicked ? "fill" : "regular"}`}
              fill="var(--icon-background)"
              size={20}
            />
          </button>
          <p className={` capitalize md:hidden "text-black/70 dark:text-white`}>
            account
          </p>
        </div>
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
        className="fixed bottom-10 z-[9000] left-10 dark:text-white rounded-md bg-secondary-background border border-border px-1 pb-1 max-w-[240px]"
      >
        <button className="cursor-pointer w-full flex items-center gap-1 py-1 hover:bg-primary-background rounded-sm px-1 my-1.5">
          <div className="size-7 rounded-sm bg-[#303030] relative overflow-hidden border-border border">
            <Image
              fill={true}
              src={getProfileIcon(user)}
              alt={user}
              blurDataURL={getProfileIcon(user)}
            />
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start">
              <span className="text-sm">{user}</span>
              <span className="text-xs">{shop?.shop}</span>
            </div>
            <CaretUpDownIcon size={18} />
          </div>
        </button>
        {userShops?.total > 1 ? (
          <div className="w-full flex flex-col pb-1.5 px-1">
            <div className="flex items-center w-full justify-start cursor-pointer gap-1 pb-0.5 transition-all hover:bg-secondary-background rounded-sm">
              <StorefrontIcon
                weight="fill"
                fill="var(--icon-background)"
                size={15}
              />
              <span className="text-sm">shops</span>
            </div>
            {userShops?.documents.map((store) => {
              if (store?.$id !== shop?.$id) {
                return (
                  <button
                    onClick={() => {
                      if (store?.$id !== shop?.$id) return;
                      setActiveShop(store);
                    }}
                    key={store?.$id}
                    className="cursor-pointer text-xs flex items-center gap-1 hover:bg-primary-background rounded-sm p-1.5"
                  >
                    <span className="inline-block w-[8px] h-[8px] rounded-[5px] border border-solid border-yellow-500 transition-colors duration-200 ease bg-yellow-400"></span>
                    {store?.shop}
                  </button>
                );
              }
            })}
          </div>
        ) : (
          <Link
            href={`/dashboard/settings/integration`}
            className="flex items-center w-full mb-2.5 justify-start cursor-pointer gap-1 transition-all hover:bg-primary-background rounded-sm p-1"
          >
            <PlusIcon weight="fill" fill="var(--icon-background)" size={15} />
            <span className="capitalize text-sm">add shop</span>
          </Link>
        )}
        <div className="bg-primary-background text-sm w-full rounded-sm flex flex-col py-1 px-1 gap-2">
          {/* <span className=" px-2">{user}</span> */}
          <div className="flex items-center w-full justify-start cursor-pointer gap-1 transition-all  rounded-sm p-1">
            <div className="flex items-center bg-secondary-background gap-1 p-1 rounded-sm border border-border">
              <button
                onClick={() => setTheme("light")}
                className={`  ${
                  theme === "light" && `bg-primary-background`
                }  p-1 rounded-xs  cursor-pointer`}
              >
                <SunIcon
                  weight="fill"
                  fill="var(--icon-background)"
                  size={15}
                />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`  ${
                  theme === "dark" && `bg-primary-background`
                }  p-1 rounded-xs  cursor-pointer`}
              >
                <MoonIcon
                  weight="fill"
                  fill="var(--icon-background)"
                  size={15}
                />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`  ${
                  theme === "system" && `bg-primary-background`
                }  p-1 rounded-xs  cursor-pointer`}
              >
                <CircleHalfIcon
                  weight="fill"
                  fill="var(--icon-background)"
                  size={15}
                />
              </button>
            </div>
            <span>Theme</span>
          </div>
          <Link
            href={"/dashboard/settings/account"}
            className="flex items-center w-full justify-start cursor-pointer gap-1 transition-all hover:bg-secondary-background rounded-sm p-1"
          >
            <UserCircleIcon
              weight="fill"
              fill="var(--icon-background)"
              size={15}
            />
            <span>Account</span>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center w-full justify-start cursor-pointer gap-1 transition-all hover:bg-secondary-background rounded-sm p-1"
          >
            <DoorOpenIcon
              weight="fill"
              fill="var(--icon-background)"
              size={15}
            />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
