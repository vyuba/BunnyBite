"use client";

import { useUserStore } from "@/app/providers/userStoreProvider";
import EditSvg from "@/components/EditSvg";
import Modal from "@/components/Modal";
import { useUpdateShop } from "@/hooks/updateShop";

const AiPersonaPage = () => {
  const { shop } = useUserStore((state) => state);
  const {
    updateShop,
    isPending,
    startTransition,
    setUpdatedData,
    updatedData,
  } = useUpdateShop(shop?.$id, "edit");

  return (
    <>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <h2 className="text-base">AI Persona</h2>
            <p className="text-sm">
              Customize the AI persona to better understand your business needs
            </p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <div className="flex flex-col gap-3">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    personality
                  </span>
                  <span className="text-xs md:text-sm text-black/70 dark:text-white/70">
                    {shop?.shop.replace(".myshopify.com", "")}
                  </span>
                </div>
                <div className="flex items-center w-full gap-4">
                  <div className="flex items-start w-full flex-col gap-1 text-black/70 dark:text-white group">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm">
                        How your chatbot should reply
                      </span>
                      <button
                        onClick={() =>
                          setUpdatedData({
                            name: "personality",
                            label: "Personality",
                            isOpen: true,
                          })
                        }
                        className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit"
                      >
                        <EditSvg />
                      </button>
                    </div>
                    <textarea
                      readOnly
                      name="personality"
                      className="bg-tertiay-background text-[#6b6b6b] focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
                      value={shop?.personality}
                      placeholder="Fill in how your AI should act..."
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Edit AI Persona"
        isOpen={updatedData?.isOpen}
        onClose={() => setUpdatedData((prev) => ({ ...prev, isOpen: false }))}
        description="Edit your AI persona."
      >
        <form
          onSubmit={(event) => {
            startTransition(async () => {
              await updateShop(event);
            });
          }}
          className="px-2 flex pb-1 gap-2 w-full flex-col"
        >
          <label className="flex items-start w-full flex-col gap-1">
            <span className="text-sm">{updatedData?.label}:</span>
            <input
              type="text"
              className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
              name={updatedData?.name}
            />
          </label>
          <button
            disabled={isPending}
            className=" self-end border w-fit border-border border-b-2  capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg"
          >
            save
          </button>
        </form>
      </Modal>
    </>
  );
};
export default AiPersonaPage;
