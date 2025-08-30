// import { clientDatabase } from "../lib/client-appwrite";
import AccountSetup from "@/components/AccountSetup";
export default function DashbordHome() {
  return (
    <div className="flex gap-5 flex-col h-full ">
      <div className="w-full flex flex-col">
        {/* The steps container  */}
        <AccountSetup />
      </div>
    </div>
  );
}
// border-r border-[#E3E3E3]
