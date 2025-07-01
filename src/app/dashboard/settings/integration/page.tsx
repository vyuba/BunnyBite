"use client";
import { clientDatabase } from "@/app/lib/client-appwrite";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { TrashIcon } from "@phosphor-icons/react";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { ID } from "appwrite";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
const IntegrationPage = () => {
  const searchParams = useSearchParams();
  const { user, userShops } = useCounterStore((state) => state);
  const [showConnect, setShowConnect] = useState(false);
  const store = searchParams.get("shop");
  useEffect(() => {
    if (store) {
      setShowConnect(!showConnect);
    }
  }, [store, showConnect]);

  const ConnectShop = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading("Saving your store", {
      id: "connect",
    });
    const formData = new FormData(e.currentTarget);
    try {
      const store = formData.get("store");
      await clientDatabase.createDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
        ID.unique(),
        {
          shop: store,
          user: user.$id,
        }
      );
      toast.success("Store saved", {
        id: "connect",
      });
    } catch (error) {
      toast.error(`Error Saving your store ${error?.message}`, {
        id: "connect",
      });
    } finally {
      toast.dismiss("connect");
    }
  };
  const deleteShop = async (id) => {
    if (!id) {
      throw new Error("Store id is required");
    }
    try {
      toast.loading("Deleting store", {
        id: "delete-store",
      });
      await clientDatabase.deleteDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
        id
      );
      toast.success("Store deleted", {
        id: "delete-store",
      });
    } catch (error) {
      toast.error(`Error deleting your store ${error?.message}`, {
        id: "delete-store",
      });
    } finally {
      toast.dismiss("delete-store");
    }
  };
  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-[#E3E3E3] px-3 pb-2">
            <h2 className="text-base">Stores</h2>
            <p className="text-sm text-black/70">
              Info&apos;s on all the stores you have installed
            </p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2 overflow-hidden">
              <label className="flex flex-col gap-1 overflow-hidden">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize flex-1 text-sm md:text-base ">
                    manage integration
                  </span>
                  <button
                    onClick={() => setShowConnect(!showConnect)}
                    className="border w-fit border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg"
                  >
                    connect new store
                  </button>
                </div>
                <AnimatePresence>
                  {showConnect && (
                    <motion.form
                      layout
                      initial={{
                        opacity: showConnect ? 1 : 0,
                        height: showConnect ? "auto" : 0,
                      }}
                      animate={{
                        opacity: showConnect ? 1 : 0,
                        height: showConnect ? "auto" : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onSubmit={ConnectShop}
                      exit={{ height: 0, opacity: 0 }}
                      className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5"
                    >
                      <label className="flex items-start w-full flex-col gap-1">
                        <span className="text-sm">Connect</span>
                        <input
                          type="text"
                          name="store"
                          className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50 rounded-md max-w-[400px] py-1.5 px-1.5 w-full text-xs md:text-sm border border-[#E3E3E3]"
                        />
                      </label>
                      <button
                        type="submit"
                        className=" w-fit bg-[#303030] border border-[#4A4A4A] text-white border-b-2  capitalize px-2.5 hover:cursor-pointer  text-sm py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <p>Save</p>
                        {/* <PencilSimpleIcon size={17} /> */}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
                <div className="w-full flex flex-col md:flex-row items-end justify-between gap-1.5">
                  {userShops &&
                    userShops.documents.map((store) => (
                      <div
                        key={store?.$id}
                        className="w-full flex flex-row items-end flex-1"
                      >
                        <label className="flex items-start w-full flex-col gap-1">
                          <span className="text-sm">Shopify</span>
                          <input
                            type="text"
                            className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-[#cacaca] focus:bg-[white] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50 rounded-md max-w-[400px] py-1.5 px-1.5 w-full text-xs md:text-sm border border-[#E3E3E3]"
                            defaultValue={store?.shop}
                          />
                        </label>
                        <div className="flex items-center gap-0.5">
                          <button className=" w-fit bg-transparent hover:bg-[var(--background)] text-black/80  capitalize px-2.5 hover:cursor-pointer  text-sm py-2 rounded-lg flex items-center gap-1">
                            <PencilSimpleIcon size={17} />
                          </button>
                          <button
                            onClick={() => deleteShop(store?.$id)}
                            className=" w-fit bg-transparent text-red-600 hover:bg-[var(--background)]  capitalize px-2.5 cursor-pointer  text-sm py-2 rounded-lg flex items-center gap-1"
                          >
                            <TrashIcon size={17} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntegrationPage;
