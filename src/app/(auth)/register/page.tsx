import RegisterPage from "@/components/pages/RegisterPage";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <RegisterPage />
    </Suspense>
  );
};

export default Page;
