import Skeleton from "./Skeleton";

const ChatHeaderLoading = () => {
  return (
    <div className="absolute top-0 z-10 left-0 w-full h-13 bg-[var(--background)] border-b border-border flex items-center justify-between px-2 overflow-hidden">
      <div className="flex items-center gap-2">
        <Skeleton styling="w-8 h-8 rounded-full" />
        <Skeleton styling="w-24 h-4 rounded" />
      </div>
      <Skeleton styling="w-10 h-5 rounded" />
    </div>
  );
};

export default ChatHeaderLoading;
