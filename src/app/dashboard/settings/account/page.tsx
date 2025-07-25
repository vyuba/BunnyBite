"use client";
import { clientAccount } from "@/app/lib/client-appwrite";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { motion } from "motion/react";
import { useCounterStore } from "@/app/providers/counter-store-provider";
// import { CopyIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

// const SettingsNavLinks = [
//   {
//     title: "Account",
//     link: "/settings/account",
//   },
//   {
//     title: "Security",
//     link: "/settings/security",
//   },
//   {
//     title: "Notifications",
//     link: "/settings/notifications",
//   },
// ];
const AccountPage = () => {
  const router = useRouter();
  const { user } = useCounterStore((state) => state);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const checkUser = async () => {
      // const user = await getLoggedInUser();
      const user = await clientAccount.get();
      console.log(user);
      //   if (user) router.push("/dashboard");
    };
    checkUser();
  }, [router]);
  return (
    <div>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <h2 className="text-base">General</h2>
            <p className="text-sm text-black/70 dark:text-white/70">
              Configure your account settings to manage your account information
              and preferences.
            </p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    Profile
                  </span>
                  <button className="border w-fit border-border border-b-2 text-black/70 dark:text-white/70 capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg">
                    save
                  </button>
                </div>
                <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
                  <input
                    type="text"
                    className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-border"
                    defaultValue={user?.name}
                  />
                  <input
                    type="text"
                    className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-xs md:text-sm border border-border"
                    defaultValue={user?.email}
                  />
                </div>
              </label>
            </div>
            {/* <div className="flex  w-full flex-col gap-2  pt-2 ">
                <label className="flex flex-col gap-1">
                  <span className="text-sm capitalize ">customthem</span>
                  <span className="text-sm text-black/70">
                    johnfre@gmail.com
                  </span>
                </label>
              </div> */}
          </div>
        </div>
        {/* <div className="flex flex-col border-t border-[#E3E3E3]">
            <div className="w-full border-b grid gap-1 border-[#E3E3E3] px-3 py-2">
              <h2 className="text-base">Twilio WhatsApp API Configuration</h2>
              <p className="text-sm  w-full text-black/70">
                Configure your Twilio WhatsApp API settings to enable BunnyBite
                to send WhatsApp messages.
              </p>
            </div>
            <div className="flex  w-full flex-col gap-2 px-3 pt-2 relative">
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute hover:bg-[#F7F7F7] p-1.5 rounded-sm cursor-pointer top-[10px] right-[10px]"
              >
                <PencilSimpleIcon size={17} />
              </button>
              <label className="flex flex-col  w-full gap-1">
                <span className="text-sm capitalize ">Phone Number</span>
                <span className="text-sm text-black/70">09161076598</span>
              </label>
              <div className="flex flex-wrap items-center justify-between  w-full gap-2">
                <label className="flex items-center gap-1">
                  <span className="text-sm"> Account SID:</span>
                  <span className="text-sm text-black/70">
                    083************************sk
                  </span>
                  <CopyIcon
                    size={17}
                    className="text-black/70 cursor-copy hover:text-black"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span className="text-sm"> Auth Token:</span>
                  <span className="text-sm text-black/70">
                    083************************sk
                  </span>
                </label>
              </div>
            </div>
          </div> */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        description="These details could be publicly available. Do not use your personal information."
        title="Edit Whatsapp API Configuration"
      >
        <form className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 px-1">
            <label className="flex flex-col gap-1 px-2">
              <span className="text-sm">Phone Number</span>
              <input
                type="text"
                className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-[white] focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm md:text-lg border border-border"
              />
            </label>
            <label className="flex flex-col gap-1 px-2">
              <span className="text-sm">Account SID</span>
              <input
                type="password"
                className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm md:text-lg border border-border"
              />
            </label>
            <label className="flex flex-col gap-1 px-2">
              <span className="text-sm">Auth Token</span>
              <input
                type="password"
                className="bg-[#F7F7F7] text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm md:text-lg border border-border"
              />
            </label>
          </div>
          <div className="w-full px-2 flex items-center gap-1 mt-1.5 pt-3 border-t border-border">
            <Button variant="ghost" label="Cancel" />
            <Button customStyling="flex-1" variant="primary" label="Save" />
          </div>
        </form>
      </Modal>
      {/* <div className="flex items-center justify-center gap-1.5 w-fit">
        <span className="text-base">johndoe1234@gmail.com</span>
        <div className="px-2  py-1.5 w-fit border border-dashed border-[#E3E3E3]  bg-[#EBEBEB] text-[#6b6b6b] text-sm">
          Verify
        </div>
      </div> */}
    </div>
  );
};
export default AccountPage;
