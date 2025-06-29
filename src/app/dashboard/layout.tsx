"use client";
import { clientAccount } from "../lib/client-appwrite";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SideBar } from "@/components/Sidebar";
import Loading from "./loading";
import { useCounterStore } from "../providers/counter-store-provider";
import PageHeader from "@/components/PageHeader";
import AnouncementBanner from "@/components/AnouncementBanner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { setCurrentUser, setUserShop, shop, user, isSidebar, setSidebar } =
    useCounterStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const user = await clientAccount.get();
        console.log("user", user);
        setCurrentUser(user);
        setUserShop(user?.$id);
        setIsLoading(false);
      } catch (error) {
        console.log("Redirecting User not logged In", error);
        router.push("/login");
      }
    };
    fetchSession();
  }, [router, setCurrentUser, setUserShop]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex w-full h-dvh">
      <SideBar shop={shop?.shop} user={user?.name} />
      <div className="h-screen overflow-hidden flex-[85%] bg-[#EBEBEB] ">
        {!isSidebar && (
          <motion.div
            onClick={() => setSidebar(!isSidebar)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed md:hidden flex justify-end inset-0 z-[1000] bg-[#EBEBEB]/45 backdrop-blur-lg`}
          >
            <span className="capitalize m-2 text-sm md:text-base text-[#303030]">
              click me to close
            </span>
          </motion.div>
        )}
        <AnouncementBanner />
        <div className="rounded-tl-xl bg-[var(--background)] border border-[#E3E3E3] h-full p-3">
          <PageHeader username={user?.name} />
          <div className="overflow-y-scroll h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
