import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { useCounterStore } from "@/app/providers/counter-store-provider";
const PageHeader = ({ username, pathname }) => {
  const { setSidebar, isSidebar } = useCounterStore((state) => state);
  return (
    <div className="flex pb-3  items-center gap-1.5">
      <button
        onClick={() => setSidebar(!isSidebar)}
        className="border w-fit md:hidden  border-[#E3E3E3] border-b-2 text-black/70 capitalize px-2 hover:cursor-pointer bg-[var(--background)] text-sm py-2 rounded-lg"
      >
        <SidebarSimpleIcon
          fill="#303030"
          size={20}
          weight={isSidebar ? "fill" : "regular"}
        />
      </button>
      <h1 className="capitalize font-medium text-base text-black/90">
        {pathname === "/dashboard"
          ? `Dashboard, welcome ${username}`
          : pathname.split("/").at(-1)}
      </h1>
    </div>
  );
};

export default PageHeader;
