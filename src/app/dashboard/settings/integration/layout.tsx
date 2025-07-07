import { Suspense } from "react";

const IntegrationLayout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense>{children}</Suspense>;
};
export default IntegrationLayout;
