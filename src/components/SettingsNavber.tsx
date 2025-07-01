"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsNavLinks = [
  {
    title: "Account",
    link: "/dashboard/settings",
  },
  {
    title: "Security",
    link: "/dashboard/settings/security",
  },
  {
    title: "Integration",
    link: "/dashboard/settings/integration",
  },
  {
    title: "Billing",
    link: "/dashboard/settings/billing",
  },
];

const SettingsNavber = () => {
  const pathname = usePathname();
  return (
    <div className="w-full overflow-x-scroll">
      <ul className="flex mt-2 gap-1 items-center p-0.5 bg-[#F7F7F7] w-fit rounded-md border border-[#E3E3E3]">
        {SettingsNavLinks.map((links, index) => (
          <Link
            href={links.link}
            key={index}
            className={`py-1 transition-colors cursor-pointer px-3 ${
              pathname === links.link
                ? "bg-white border border-[#E3E3E3]"
                : "hover:bg-[#f0efef]"
            }  rounded-sm`}
          >
            <h2>{links.title}</h2>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SettingsNavber;
