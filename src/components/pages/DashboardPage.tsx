"use client";
import { clientAccount } from "@/app/lib/client-appwrite";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SideBar } from "@/components/Sidebar";
import Loading from "@/app/dashboard/loading";
import { useUserStore } from "@/app/providers/userStoreProvider";
import PageHeader from "@/components/PageHeader";
import AnouncementBanner from "@/components/AnouncementBanner";
import { useSearchParams } from "next/navigation";
// import AppwriteJWTRefresher from "../AppwriteJwtRefresher";

const DashboardPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = searchParams.get("shop");
  const { setCurrentUser, setUserShop, user, isSidebar, setSidebar } =
    useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const user = await clientAccount.get();
        console.log("user", user);
        setCurrentUser(user);
        setUserShop(user?.$id);
        if (store) {
          router.push(`/dashboard/settings/integration?shop=${store}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Redirecting User not logged In", error);
        if (store) {
          router.push(`/login?shop=${store}`);
        }
        router.push("/login");
      }
    };
    fetchSession();
  }, [router, setCurrentUser, store, setUserShop]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* <AppwriteJWTRefresher /> */}
      <div className="flex w-full h-dvh">
        <SideBar user={user?.name} />
        <div className="h-screen overflow-hidden flex-[85%] bg-secondary-background ">
          {isSidebar && (
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
          <div className="rounded-tl-xl bg-[var(--background)] border border-border h-full p-3">
            <PageHeader username={user?.name} />
            <div className="overflow-y-scroll h-fit">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
