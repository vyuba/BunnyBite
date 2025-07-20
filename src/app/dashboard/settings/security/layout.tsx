const SecuritySettingsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid gap-3 py-3 w-full">
      <div className="flex flex-col w-full">
        <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
          <h2 className="text-base">Privacy</h2>
          <p className="text-sm text-black/70 dark:text-white">
            Info&apos;s on all the stores you have installed
          </p>
        </div>
        <div className=" px-3">{children}</div>
      </div>
    </div>
  );
};

export default SecuritySettingsLayout;
