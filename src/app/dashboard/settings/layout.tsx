import SettingsNavber from "@/components/SettingsNavber";

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
