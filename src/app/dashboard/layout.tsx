"use client";
// import { getLoggedInUser } from "@/helpers/appwrite-helpers";
// import { redirect } from "next/navigation";
import { clientAccount } from "../lib/client-appwrite";
import { useEffect, useState } from "react";
// import { Models } from "appwrite";
import { useRouter, usePathname } from "next/navigation";
import { SideBar } from "@/components/Sidebar";
import Loading from "./loading";
import { useCounterStore } from "../providers/counter-store-provider";
import { SidebarSimpleIcon } from "@phosphor-icons/react/dist/ssr";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setCurrentUser, setCurrentShop, setSidebar, isSidebar, shop, user } =
    useCounterStore((state) => state);
  const pathname = usePathname();
  // const [isUser, setUser] = useState<
  //   Models.User<Models.Preferences> | null | undefined
  // >();
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const user = await clientAccount.get();
        console.log("user", user);
        setCurrentUser(user);
        setCurrentShop(user?.$id);
        setIsLoading(false);
      } catch (error) {
        console.log("Redirecting User not logged In", error);
        router.push("/login");
      }
    };
    fetchSession();
  }, [router, setCurrentUser, setCurrentShop]);

  if (isLoading) {
    return <Loading />;
  }
  console.log(pathname.split("/").at(-1));
  // if (isLoggedIn === false) {
  // }
  return (
    <div className="flex w-full h-screen">
      <SideBar pathname={pathname} shop={shop?.shop} user={user?.name} />
      <div className="h-screen overflow-hidden flex-[85%] bg-[#EBEBEB] ">
        <div className="w-full h-14 bg-[#EBEBEB]  flex flex-row-reverse md:flex-row justify-between items-center">
          <div className="flex items-center gap-1 px-4">
            <p className="capitalize text-black/70 text-sm font-medium hidden md:block">
              just 9 days on your advanced plan
            </p>
            <button className="border border-[#E3E3E3] border-b-2 text-black/70 capitalize px-3 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg">
              manage plan
            </button>
          </div>
          <div className="flex items-center gap-1 px-4">
            <p className="capitalize text-sm ">
              continue configuring your profile
            </p>
          </div>
        </div>
        <div className="rounded-tl-xl bg-[var(--background)] border border-[#E3E3E3] h-full p-3">
          <div className="flex pb-3  items-center gap-1.5">
            <button
              onClick={() => setSidebar(!isSidebar)}
              className="border w-fit  border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg"
            >
              <SidebarSimpleIcon
                fill="#303030"
                size={20}
                weight={isSidebar ? "fill" : "regular"}
              />
            </button>
            <h1 className="capitalize font-medium text-base text-black/90">
              {pathname === "/dashboard"
                ? `Dashboard, welcome ${user?.name}`
                : pathname.split("/").at(-1)}
            </h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
