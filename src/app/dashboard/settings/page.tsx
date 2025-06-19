"use client";
import { clientAccount } from "@/app/lib/client-appwrite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsNavLinks = [
  {
    title: "Account",
    link: "/settings/account",
  },
  {
    title: "Security",
    link: "/settings/security",
  },
  {
    title: "Notifications",
    link: "/settings/notifications",
  },
];
const SettingsPage = () => {
  const router = useRouter();
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
      <h1 className="capitalize font-medium">Settings</h1>
      <ul className="flex mt-2 gap-1 items-center p-1 bg-[#E3E3E3] w-fit rounded-md">
        {SettingsNavLinks.map((links, index) => (
          <li
            key={index}
            className={`py-1 cursor-pointer px-3 ${
              index === 0 ? "bg-white" : "bg-transparent"
            }  rounded-sm`}
          >
            <h2>{links.title}</h2>
          </li>
        ))}
      </ul>
      <div className="py-3 flex flex-col gap-2.5">
        <h2 className="text-base">Twilio WhatsApp API Configuration</h2>
        <p className="text-sm text-black/70">
          Configure your Twilio WhatsApp API settings to enable BunnyBite to
          send WhatsApp messages.
        </p>
        <div className="flex flex-col gap-2 w-fit">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-black/70"> Account SID:</span>
            <input
              type="text"
              readOnly
              className="bg-[#EBEBEB] w-full max-w-[400px] max-h-[40px] p-2 border border-[#E3E3E3] rounded-sm text-[#6b6b6b] focus:bg-[#f9fafb] focus:outline-none focus:border-[#cacaca] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50"
              value={"083jkhiposyaf8disa;hijfksd;hajdsk"}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-black/70"> Auth Token:</span>
            <input
              type="password"
              readOnly
              className="bg-[#EBEBEB] w-full max-w-[400px] max-h-[40px] p-2 border border-[#E3E3E3] rounded-sm text-[#6b6b6b] focus:bg-[#f9fafb] focus:outline-none focus:border-[#cacaca] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50"
              value={"083jkhiposyaf8disa;hijfksd;hajdsk"}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-black/70"> WhatsApp Number:</span>
            <input
              type="text"
              readOnly
              className="bg-[#EBEBEB] w-full max-w-[400px] max-h-[40px] p-2 border border-[#E3E3E3] rounded-sm text-[#6b6b6b] focus:bg-[#f9fafb] focus:outline-none focus:border-[#cacaca] focus-border-2 focus:ring focus:ring-[#E3E3E3] focus:ring-opacity-50"
              value={"083jkhiposyaf8disa;hijfksd;hajdsk"}
            />
          </label>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 w-fit">
        <span className="text-base">johndoe1234@gmail.com</span>
        <div className="px-2  py-1.5 w-fit border border-dashed border-[#E3E3E3]  bg-[#EBEBEB] text-[#6b6b6b] text-sm">
          Verify
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
