import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bunny-bite.vercel.app/dashboard/campaign"),
  title: "Campaign",
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
