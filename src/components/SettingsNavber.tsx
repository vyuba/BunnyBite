"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsNavLinks = [
  {
    title: "account",
    link: "/dashboard/settings/account",
  },
  {
    title: "ai-persona",
    link: "/dashboard/settings/ai-persona",
  },
  {
    title: "security",
    link: "/dashboard/settings/security",
  },
  {
    title: "integration",
    link: "/dashboard/settings/integration",
  },
  {
    title: "billing",
    link: "/dashboard/settings/billing",
  },
  {
    title: "credit-grants",
    link: "/dashboard/settings/credit-grants",
  },
];

const SettingsNavber = () => {
  const pathname = usePathname();
  return (
    <div className="w-full overflow-x-scroll">
      <ul className="flex mt-2 gap-1 items-center p-0.5 bg-tertiay-background w-fit rounded-md border border-border">
        {SettingsNavLinks.map((links, index) => (
          <Link
            href={links.link}
            key={index}
            className={`py-1 transition-colors text-black/70 dark:text-white capitalize cursor-pointer px-3 ${
              pathname.includes(links.title)
                ? "bg-primary-background border border-border"
                : "hover:bg-[#f0efef] dark:hover:bg-[#111111] border-border"
            }  rounded-sm`}
          >
            <h2 className="text-nowrap">
              {links.title === "credit-grants"
                ? "Credit grants"
                : links.title === "ai-persona"
                ? "AI Persona"
                : links.title}
            </h2>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SettingsNavber;
