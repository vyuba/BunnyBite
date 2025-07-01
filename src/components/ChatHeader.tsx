import { clientDatabase } from "@/app/lib/client-appwrite";
import { useChatProvider } from "@/app/providers/SidebarStoreProvider";
// import { useCounterStore } from "@/app/providers/counter-store-provider";
import { ArrowLeftIcon, RobotIcon } from "@phosphor-icons/react";
import Image from "next/image";

const changeAiToggle = async (Id, value) => {
  try {
    const response = await clientDatabase.updateDocument(
      process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID!,
      Id,
      {
        isAIActive: value,
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
const ChatHeader = ({ id, svg, setMessage, message }) => {
  const { selectedChat, setIsChatOpen } = useChatProvider();
  //   const { shop } = useCounterStore((state) => state);
  // console.log(id);
  return (
    <div className="absolute top-0 left-0 w-full h-13 bg-[var(--background)] border-b border-[#E3E3E3] flex items-center justify-between px-2">
      {/* profile icon and name container */}
      <div className="w-fit h-full flex items-center gap-2">
        <ArrowLeftIcon
          onClick={() => setIsChatOpen(true)}
          size={16}
          weight="bold"
          className="p-2 md:hidden text-black/70 hover:bg-white rounded-md cursor-pointer size-fit "
        />
        <Image
          src={svg}
          alt=""
          width={30}
          height={30}
          className="bg-white block border-[#E3E3E3] border rounded-full size-10"
        />
        <p className="text-sm  text-black/70 capitalize font-medium">
          {selectedChat?.customer_name}
        </p>
      </div>
      <div className="flex w-fit h-full justify-center items-center gap-1 relative">
        <RobotIcon size={20} fill="#303030" />
        <label className="switch cursor-pointer">
          <input
            type="checkbox"
            checked={message.toggleAI}
            onChange={async () => {
              await changeAiToggle(id, !message.toggleAI);
              //   setActiveShop(activeShop);
              setMessage((prev) => ({
                ...prev,
                toggleAI: !prev.toggleAI,
              }));
            }}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};
export default ChatHeader;
