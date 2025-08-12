import { ChatProvider } from "@/app/providers/SidebarStoreProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bunny-bite.vercel.app/dashboard/chat"),
  title: "Chat",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col md:z-0 w-full h-fit gap-2 pb-15">
        <ChatProvider>{children}</ChatProvider>
      </div>
    </>
  );
}
