import SettingsNavber from "@/components/SettingsNavber";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bunny-bite.vercel.app/dashboard/settings"),
  title: "Settings",
};

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full max-w-[796px] mx-auto flex flex-col gap-1.5">
      <SettingsNavber />
      <div className="w-full text-black/70 dark:text-white bg-primary-background rounded-lg border border-border h-auto flex flex-col gap-1.5 ">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
