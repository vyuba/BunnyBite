import { clientDatabase } from "@/app/lib/client-appwrite";
import { Shop } from "@/types";
import { useTransition, useState, FormEvent } from "react";
import { toast } from "sonner";
import { ID } from "appwrite";

type UpdateData = { name: string; label: string; isOpen: boolean };

export function useUpdateShop(
  id: Shop["$id"],
  type: "edit" | "delete" | "create",
  user?: { $id: string }
) {
  const [isPending, startTransition] = useTransition();
  const [updatedData, setUpdatedData] = useState<UpdateData>({
    name: "",
    label: "",
    isOpen: false,
  });

  let updateShop: ((event: FormEvent<HTMLFormElement>) => void) | undefined;
  let deleteShop: (() => void) | undefined;
  let connectShop: ((e: FormEvent<HTMLFormElement>) => void) | undefined;

  switch (type) {
    case "edit":
      updateShop = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = {
          [updatedData?.name]: formData.get(updatedData?.name)?.toString(),
        };

        startTransition(() => {
          (async () => {
            try {
              if (!id) return;
              toast.loading("Updating " + updatedData?.label + "...", {
                id: "updateShop",
              });

              await clientDatabase.updateDocument(
                process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
                process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
                id,
                { ...data }
              );

              setUpdatedData({ label: "", name: "", isOpen: false });
              formData.delete(updatedData?.name);

              toast.dismiss("updateShop");
              toast.success("Updated successfully");
            } catch (error) {
              toast.dismiss("updateShop");
              toast.error("Failed to update", error?.message);
            }
          })();
        });
      };
      break;

    case "delete":
      deleteShop = () => {
        if (!id) throw new Error("Store id is required");

        startTransition(() => {
          (async () => {
            try {
              toast.loading("Deleting store", { id: "delete-store" });
              await clientDatabase.deleteDocument(
                process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
                process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
                id
              );
              toast.success("Store deleted", { id: "delete-store" });
            } catch (error) {
              toast.error(`Error deleting your store ${error?.message}`, {
                id: "delete-store",
              });
            } finally {
              toast.dismiss("delete-store");
            }
          })();
        });
      };
      break;

    case "create":
      connectShop = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(() => {
          (async () => {
            try {
              toast.loading("Saving your store", { id: "connect" });

              const store = formData.get("shop");
              await clientDatabase.createDocument(
                process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
                process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
                ID.unique(),
                {
                  shop: store,
                  user: user?.$id,
                }
              );
              toast.success("Store saved", { id: "connect" });
            } catch (error) {
              toast.error(`Error Saving your store ${error?.message}`, {
                id: "connect",
              });
            } finally {
              toast.dismiss("connect");
            }
          })();
        });
      };
      break;
  }

  return {
    updateShop,
    deleteShop,
    connectShop,
    updatedData,
    setUpdatedData,
    isPending,
    startTransition,
  };
}
