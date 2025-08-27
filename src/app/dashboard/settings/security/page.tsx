"use client";
import { useUserStore } from "@/app/providers/userStoreProvider";
import EditSvg from "@/components/EditSvg";
import Modal from "@/components/Modal";
import { useUpdateShop } from "@/hooks/updateShop";

const SecurityPage = () => {
  const { shop } = useUserStore((state) => state);
  const { updateShop, isPending, setUpdatedData, updatedData } = useUpdateShop(
    shop?.$id,
    "edit"
  );

  return (
    <div className="flex  w-full flex-col gap-2 pt-2 text-black/70 dark:text-white">
      <label className="flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          <span className="capitalize text-sm md:text-base ">
            Twilio WhatsApp API Configuration
          </span>
        </div>
        {shop ? (
          <>
            <label className="flex items-start w-full flex-col gap-1 text-black/70 dark:text-white group">
              <div className="flex justify-between items-center w-full">
                <span className="text-sm">ChatBot Whatsapp No</span>
                <button
                  onClick={() =>
                    setUpdatedData({
                      name: "shop_number",
                      label: "ChatBot Whatsapp No",
                      isOpen: true,
                    })
                  }
                  className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit"
                >
                  <EditSvg />
                </button>
              </div>
              <input
                type="text"
                className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
                value={shop?.shop_number || "No Phone number"}
                readOnly
              />
            </label>
            <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
              <label className="flex items-start w-full flex-col gap-1 group">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm"> Auth Token</span>
                  <button
                    onClick={() =>
                      setUpdatedData({
                        name: "twillio_auth_token",
                        label: "Auth Token",
                        isOpen: true,
                      })
                    }
                    className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit"
                  >
                    <EditSvg />
                  </button>
                </div>
                <input
                  type="text"
                  className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-border"
                  value={shop?.twillio_auth_token || "No Key"}
                  readOnly
                />
              </label>
              <label className="flex items-start w-full flex-col gap-1 group">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm">Account SID:</span>
                  <button
                    onClick={() =>
                      setUpdatedData({
                        name: "twillio_account_siid",
                        label: "Account SID",
                        isOpen: true,
                      })
                    }
                    className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit"
                  >
                    <EditSvg />
                  </button>
                </div>
                <input
                  type="text"
                  className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
                  value={shop?.twillio_account_siid || "No Key"}
                  readOnly
                />
              </label>
            </div>
          </>
        ) : (
          <p className="text-sm text-black/50 dark:text-white/50">
            No shop added to your account to you can not add security api
          </p>
        )}
      </label>
      <Modal
        title="Twilio Account SID"
        isOpen={updatedData?.isOpen}
        onClose={() => setUpdatedData((prev) => ({ ...prev, isOpen: false }))}
        description="Edit your Twilio Account SID."
      >
        <form
          onSubmit={updateShop}
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
    </div>
  );
};

export default SecurityPage;
