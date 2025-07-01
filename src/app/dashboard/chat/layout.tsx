import { ChatProvider } from "@/app/providers/SidebarStoreProvider";

export default function ChatLayout({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col md:z-0 w-full h-fit gap-2 pb-15">
        <div className="w-full relative md:z-0 overflow-hidden h-[calc(100dvh-135px)] flex gap-2">
          <ChatProvider>
            {children}
            {messages}
          </ChatProvider>
        </div>
      </div>
    </>
  );
}
