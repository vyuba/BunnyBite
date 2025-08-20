import { clientDatabase } from "@/app/lib/client-appwrite";
import { Shop } from "@/types";
import { useTransition, useState, FormEvent } from "react";
import { toast } from "sonner";

type UpdateData = { name: string; label: string; isOpen: boolean };

export function useUpdateShop(shop: Shop) {
  const [isPending, startTransition] = useTransition();
  const [updatedData, setUpdatedData] = useState<UpdateData>({
    name: "",
    label: "",
    isOpen: false,
  });

  const updateShop = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      [updatedData?.name]: formData.get(updatedData?.name)?.toString(),
    };

    try {
      if (!shop?.$id) return;
      toast.loading("Updating " + updatedData?.label + "...", {
        id: "updateShop",
      });

      await clientDatabase.updateDocument(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
        shop.$id,
        {
          ...data,
        }
      );

      setUpdatedData({ label: "", name: "", isOpen: false });
      formData.delete(updatedData?.name);

      toast.dismiss("updateShop");
      toast.success("Updated successfully");
    } catch (error) {
      toast.dismiss("updateShop");
      toast.error("Failed to update", error?.message);
    }
  };

  return {
    updateShop,
    updatedData,
    setUpdatedData,
    isPending,
    startTransition,
  };
}
