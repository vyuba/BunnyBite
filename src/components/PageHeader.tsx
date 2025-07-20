import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { usePathname } from "next/navigation";
const PageHeader = ({ username }) => {
  const { setSidebar, isSidebar } = useCounterStore((state) => state);
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="flex pb-3  items-center gap-1.5">
      <button
        onClick={() => setSidebar(!isSidebar)}
        className="border w-fit md:hidden  border-border border-b-2 text-black/70 dark:text-white capitalize px-2 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg"
      >
        <SidebarSimpleIcon
          fill="var(--icon-background)"
          size={20}
          weight={isSidebar ? "fill" : "regular"}
        />
      </button>
      <h1 className="capitalize font-medium text-base text-black/90 dark:text-white/90">
        {pathname === "/dashboard"
          ? `Dashboard, welcome ${username}`
          : pathname.split("/").includes("chat")
          ? "Chats"
          : pathname.includes("security")
          ? "Settings / security"
          : pathname.includes("settings")
          ? `Settings / ${pathname.split("/").at(-1)}`
          : pathname.split("/").at(-1)}
      </h1>
    </div>
  );
};

export default PageHeader;
