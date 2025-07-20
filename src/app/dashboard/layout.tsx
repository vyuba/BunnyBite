import { Suspense } from "react";
import DashboardPage from "@/components/pages/DashboardPage";
import { ThemeProvider } from "../providers/ThemeProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <ThemeProvider>
        <DashboardPage>{children}</DashboardPage>
      </ThemeProvider>
    </Suspense>
  );
};

export default Layout;
