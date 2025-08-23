import { clientAccount } from "@/app/lib/client-appwrite";
import { useUserStore } from "@/app/providers/userStoreProvider";
import { useTransition, useState, FormEvent } from "react";
import { toast } from "sonner";

type UpdateData = { name: string; label: string; isOpen: boolean };

export function useUpdateUsername() {
  const [isPending, startTransition] = useTransition();
  const { setCurrentUser } = useUserStore((state) => state);
  const [updatedData, setUpdatedData] = useState<UpdateData>({
    name: "",
    label: "",
    isOpen: false,
  });

  const updateUsername = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      [updatedData?.name]: formData.get(updatedData?.name)?.toString(),
    };

    try {
      toast.loading("Updating " + updatedData?.label + "...", {
        id: "updateUsername",
      });

      const user = await clientAccount.updateName(data.name);
      setCurrentUser(user);
      setUpdatedData({ label: "", name: "", isOpen: false });
      formData.delete(updatedData?.name);

      toast.dismiss("updateUsername");
      toast.success("Updated successfully");
    } catch (error) {
      toast.dismiss("updateUsername");
      toast.error("Failed to update Username", error?.message);
    }
  };

  return {
    updateUsername,
    updatedData,
    setUpdatedData,
    isPending,
    startTransition,
  };
}
