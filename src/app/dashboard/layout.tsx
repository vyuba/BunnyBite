import { Suspense } from "react";
import DashboardPage from "@/components/pages/DashboardPage";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <DashboardPage>{children}</DashboardPage>
    </Suspense>
  );
};

export default Layout;
