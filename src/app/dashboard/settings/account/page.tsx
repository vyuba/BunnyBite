"use client";

// import { clientAccount } from "@/app/lib/client-appwrite";
// import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/providers/userStoreProvider";
import EditSvg from "@/components/EditSvg";
import Modal from "@/components/Modal";
import { useUpdateUsername } from "@/hooks/updateUser";

const AccountPage = () => {
  // const router = useRouter();
  const { user } = useUserStore((state) => state);
  const {
    updateUsername,
    updatedData,
    setUpdatedData,
    startTransition,
    isPending,
  } = useUpdateUsername();
  // useEffect(() => {
  //   const checkUser = async () => {
  //     // const user = await getLoggedInUser();
  //     const user = await clientAccount.get();
  //     console.log(user);
  //     //   if (user) router.push("/dashboard");
  //   };
  //   checkUser();
  // }, [router]);
  return (
    <div>
      <div className="grid gap-3 py-3 w-full">
        <div className="flex flex-col w-full">
          <div className="w-full border-b grid gap-1 border-border px-3 pb-2">
            <h2 className="text-base">General</h2>
            <p className="text-sm text-black/70 dark:text-white/70">
              Configure your account settings to manage your account information
              and preferences.
            </p>
          </div>
          <div className=" px-3">
            <div className="flex  w-full flex-col gap-2 pt-2">
              <label className="flex flex-col gap-1">
                <div className="w-full flex items-center justify-between">
                  <span className="capitalize text-sm md:text-base ">
                    Profile
                  </span>
                </div>
                <div className="w-full flex flex-col md:flex-row items-center gap-1.5">
                  <label className="flex items-start w-full flex-col gap-1 group">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm">Username:</span>
                      <button
                        onClick={() =>
                          setUpdatedData({
                            name: "name",
                            label: "username",
                            isOpen: true,
                          })
                        }
                        className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit"
                      >
                        <EditSvg />
                      </button>
                    </div>
                    <input
                      name="name"
                      type="text"
                      className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
                      defaultValue={user?.name}
                      readOnly
                    />
                  </label>
                  <label className="flex items-start w-full flex-col gap-1 group">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm">Email:</span>
                      <button
                        onClick={() =>
                          setUpdatedData({
                            name: "email",
                            label: "Email",
                            isOpen: true,
                          })
                        }
                        className="hover:bg-secondary-background visible md:invisible group-hover:visible transition-all p-1.5 rounded-sm cursor-pointer w-fit"
                      >
                        <EditSvg />
                      </button>
                    </div>
                    <input
                      name="email"
                      type="email"
                      className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
                      defaultValue={user?.email}
                      readOnly
                    />
                  </label>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={updatedData.isOpen}
        onClose={() => setUpdatedData({ ...updatedData, isOpen: false })}
        description="These details could be publicly available. Do not use your personal information."
        title={`Edit ${updatedData?.label}`}
      >
        <form
          onSubmit={(event) => {
            startTransition(async () => {
              await updateUsername(event);
            });
          }}
          className="px-2 flex pb-1 gap-2 w-full flex-col"
        >
          <label className="flex items-start w-full flex-col gap-1">
            <span className="text-sm">{updatedData?.label}:</span>
            <input
              type="text"
              className="bg-tertiay-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-1.5 px-1.5 w-full text-sm border border-border"
              name={updatedData?.name}
            />
          </label>
          <button
            disabled={isPending}
            className=" self-end border w-fit border-border border-b-2  capitalize px-2.5 hover:cursor-pointer bg-[var(--background)] text-sm py-1.5 rounded-lg"
          >
            save
          </button>
        </form>
      </Modal>
    </div>
  );
};
export default AccountPage;
