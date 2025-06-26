import { ArrowLeftIcon, RobotIcon } from "@phosphor-icons/react";
import Image from "next/image";

const ChatHeader = ({
  setIsChatOpen,
  svg,
  selectedChat,
  setMessage,
  message,
}) => {
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
        <label className="switch">
          <input
            type="checkbox"
            checked={message.toggleAI}
            onChange={() => {
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
