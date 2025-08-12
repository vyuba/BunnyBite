import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bunny-bite.vercel.app/dashboard/refunds"),
  title: "Refunds",
};

export default function RefundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
