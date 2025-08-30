import { clientDatabase } from "@/app/lib/client-appwrite";
import { useUserStore } from "@/app/providers/userStoreProvider";
import { GearIcon } from "@phosphor-icons/react";
import { Models, Query } from "appwrite";
import Link from "next/link";
import { useEffect, useState } from "react";

const NotificationContainer = ({ setIsProfileClicked, isProfileClicked }) => {
  const { user } = useUserStore((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] =
    useState<Models.DocumentList<Models.Document>>(null);
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        if (!user?.$id) {
          throw new Error("user id not provided");
        }
        const response = await clientDatabase.listDocuments(
          process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID!,
          [Query.equal("user_id", user?.$id)]
        );
        setIsLoading(false);
        console.log("Notification", response);
        setNotifications(response);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchRefunds();
  }, [user?.$id]);

  return (
    <div className="w-full h-[400px]">
      <span className=" p-3 w-full flex items-center justify-between">
        <p className=" text-sm md:text-base">Notifications</p>
        <Link
          onClick={() => setIsProfileClicked(!isProfileClicked)}
          href={"/dashboard/settings/account"}
        >
          <GearIcon
            weight={`regular`}
            fill="var(--icon-background)"
            size={20}
          />
        </Link>
      </span>
      <ul className="w-full flex flex-col">
        {notifications?.total > 0 ? (
          notifications?.documents.map((noti) => (
            <li
              key={noti?.$id}
              className="w-full cursor-pointer hover:bg-background border-y text-xs md:text-sm border-border px-2 py-3"
            >
              {noti?.message}
            </li>
          ))
        ) : isLoading ? (
          <li className="w-full cursor-pointer hover:bg-background border-y text-xs md:text-sm border-border px-2 py-3">
            Loading
          </li>
        ) : (
          <li className="w-full cursor-pointer hover:bg-background border-y text-xs md:text-sm border-border px-2 py-3">
            No notifications
          </li>
        )}
      </ul>
    </div>
  );
};

export default NotificationContainer;
