"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useChatProvider } from "@/app/providers/SidebarStoreProvider";

const Loading = () => {
  const { isChatOpen } = useChatProvider();
  return (
    <div
      className={`w-full ${
        isChatOpen ? "translate-x-full z-10" : " translate-x-0 z-20  "
      } md:translate-x-0 md:z-0  h-full relative duration-300  bg-white overflow-hidden rounded-md border border-[#E3E3E3]`}
    >
      <div className="w-full h-full flex items-center bg-white justify-center overflow-hidden rounded-md border border-[#E3E3E3]">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
};

export default Loading;
