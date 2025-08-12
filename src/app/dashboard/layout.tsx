import { Suspense } from "react";
import DashboardPage from "@/components/pages/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bunny-bite.vercel.app/dashboard"),
  title: {
    default: "Dashboard",
    template: "%s | BunnyBite",
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <DashboardPage>{children}</DashboardPage>
    </Suspense>
  );
};

export default Layout;
