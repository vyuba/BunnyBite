"use client";
import { useUserStore } from "@/app/providers/userStoreProvider";
import EditSvg from "@/components/EditSvg";
import Modal from "@/components/Modal";
import { useUpdateShop } from "@/hooks/updateShop";
import { TrashIcon } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Type } from "@/types";
const IntegrationPage = () => {
  const searchParams = useSearchParams();
  const { user, userShops } = useUserStore((state) => state);
  const store = searchParams.get("shop");
  const [type, setType] = useState<Type | null>(null);
  const [shopId, setShopId] = useState(null);

  const {
    setUpdatedData,
    updatedData,
    updateShop,
    deleteShop,
    connectShop,
    isPending,
  } = useUpdateShop(shopId, type, user);

  useEffect(() => {
    if (!store) return;
    setUpdatedData({ name: "shop", label: "shop name", isOpen: true });
    setType("create");
  }, [store, setUpdatedData]);

  return (
    <>
      <div className="grid gap-3 py-3 w-full text-black/70 dark:text-white">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <h2 className="text-base">Stores</h2>
            <p className="text-sm text-black/70 dark:text-white/70">
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
                    onClick={() => {
                      setType("create");
                      setUpdatedData({
                        name: "shop",
                        label: "shop name",
                        isOpen: true,
                      });
                    }}
                    className="border w-fit border-border border-b-2  capitalize px-2.5 hover:cursor-pointer bg-tertiay-background text-sm py-1.5 rounded-lg"
                  >
                    connect new store
                  </button>
                </div>
                {/* <AnimatePresence>
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
                          className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md max-w-[400px] py-1.5 px-1.5 w-full text-sm border border-border"
                          value={store}
                          onChange={(e) => console.log(store, e)}
                        />
                      </label>
                      <button
                        type="submit"
                        className=" w-fit bg-[#303030] border border-[#4A4A4A] text-white border-b-2  capitalize px-2.5 hover:cursor-pointer  text-sm py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <p>Save</p>
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence> */}
                <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-between gap-1.5">
                  {userShops?.total !== 0 ? (
                    userShops?.documents.map((store) => (
                      <div
                        key={store?.$id}
                        className="w-full flex flex-row group "
                      >
                        <label className="w-full flex items-start  flex-col gap-1">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-sm capitalize">
                              {store?.shop.replace(".myshopify.com", "")}
                            </span>
                            <div className="flex items-center gap-0.5 visible md:invisible group-hover:visible">
                              <button
                                onClick={() => {
                                  setType("edit");
                                  setUpdatedData({
                                    name: "shop",
                                    label: "shop name",
                                    isOpen: true,
                                  });
                                  setShopId(store?.$id);
                                }}
                                className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit "
                              >
                                <EditSvg />
                              </button>
                              <button
                                onClick={async () => {
                                  setType("delete");
                                  setUpdatedData({
                                    name: `store ${store?.shop}`,
                                    label: "This action cannot be undone.",
                                    isOpen: true,
                                  });
                                  setShopId(store?.$id);
                                  // await deleteShop();
                                }}
                                className=" w-fit bg-transparent hover:bg-secondary-background text-red-600   capitalize px-2.5 cursor-pointer  text-sm py-2 rounded-lg flex items-center gap-1"
                              >
                                <TrashIcon size={17} />
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            className="w-full bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5  text-sm border border-border"
                            defaultValue={store?.shop}
                          />
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-black/50 dark:text-white/50">
                      You have not added any stores yet
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={
          type === "create"
            ? "Add your store"
            : type === "delete"
            ? "Delete your store"
            : "Edit your store"
        }
        description={
          type === "delete"
            ? `Are you sure you want to delete ${updatedData?.name}?`
            : type === "create"
            ? "Add your store name"
            : "Edit your store name"
        }
        isOpen={updatedData.isOpen}
        onClose={() =>
          setUpdatedData((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      >
        <form
          onSubmit={
            type === "edit"
              ? updateShop
              : type === "create"
              ? connectShop
              : deleteShop
          }
          className="px-2 flex pb-1 gap-2 w-full flex-col"
        >
          <label className={` items-start w-full flex-col gap-1`}>
            <span className={`text-sm ${type === "delete" && "font-medium"}`}>
              {updatedData?.label}
            </span>
            <input
              {...(store ? { value: store } : {})}
              type="text"
              name={updatedData?.name}
              className={`bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border ${
                type === "delete" ? "hidden" : " "
              }`}

              // onChange={(e) => console.log(store, e)}
            />
          </label>
          <button
            disabled={isPending}
            type="submit"
            className={` self-end border w-fit border-b-2  capitalize px-2.5 hover:cursor-pointer  text-sm py-1.5 rounded-lg ${
              type === "delete"
                ? "bg-red-600 border-red-900 text-white"
                : "bg-[var(--background)] border-border  "
            }`}
          >
            <p>{type === "delete" ? "Delete" : "Save"}</p>
          </button>
        </form>
      </Modal>
    </>
  );
};

export default IntegrationPage;
