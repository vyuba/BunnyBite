"use client";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { clientAccount } from "@/app/lib/client-appwrite";
import { ID } from "appwrite";
import { motion } from "motion/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SmileyXEyesIcon } from "@phosphor-icons/react";
import { createUserSetupGuide } from "@/client-utils";

export interface Status {
  message: string | null;
  type: "success" | "error" | null;
}
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({
    message: null,
    type: null,
  });
  const [isShop, setIsShop] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const shop = searchParams.get("shop");
  useEffect(() => {
    if (shop) {
      console.log(shop);
      setIsShop(true);
    }
  }, [isShop, shop]);

  const handleSignUpwithEmail = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!password || !email) {
      console.log("password and email are required");
      setStatus({
        message: "Password and email are required",
        type: "error",
      });
      throw new Error("Password and email are required");
    }

    setLoading(true);
    toast.loading("Registering...", {
      id: "Register",
    });
    try {
      const user = await clientAccount.create(
        ID.unique(),
        email as string,
        password as string
      );

      await createUserSetupGuide(user.$id);

      setStatus({
        message: "Account created successfully",
        type: "success",
      });
      toast.success(status.message, {
        id: "Register",
      });
      setLoading(false);
      if (shop) {
        router.push(`/login?shop=${shop}`);
      }
      router.push(`/login`);
    } catch (error) {
      setStatus({
        message: error.message,
        type: "error",
      });
      toast.error(status.message, {
        id: "Register",
        icon: <SmileyXEyesIcon weight="fill" fill="#303030" />,
        description: error?.message,
      });
      setLoading(false);
      console.log(error);
    } finally {
      // toast.dismiss("Register");
    }
  };

  return (
    <div className=" w-full h-screen flex items-center justify-center bg-secondary-background px-4">
      <div className="flex flex-col w-full max-w-[400px]">
        <div className="flex flex-col gap-2 items-center justify-center pb-8">
          <div className="flex items-center gap-3">
            <div className="border hover:cursor-pointer size-10 border-[#4A4A4A] hover:border-b-2 transition-[border] text-black/70 capitalize  bg-[#303030] flex items-center justify-center text-sm  rounded-lg">
              <Image
                width={40}
                height={40}
                src={"/bunnyBite-logo.svg"}
                alt="BunnyBite Logo"
                className="p-1"
              />
            </div>
            {isShop && (
              <>
                +
                <Image
                  src="/shopify_glyph_black.svg"
                  alt="logo"
                  width={45}
                  height={45}
                  className="w-[45px] h-[45px] md:w-[70px] md:h-[70px]"
                />
              </>
            )}
          </div>
          <h1 className="text-center text-lg md:text-xl font-medium text-black/70 dark:text-white">
            Sign up
          </h1>
        </div>
        <form
          onSubmit={handleSignUpwithEmail}
          className=" flex flex-col items-center w-full gap-5"
        >
          <div className="flex flex-col gap-2.5 w-full">
            <input
              id="email"
              name="email"
              className="bg-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-3 px-3 w-full text-base md:text-lg border border-border"
              type="email"
              placeholder="Email address"
            />
            <input
              id="password"
              name="password"
              className="bg-background text-[#6b6b6b]  focus:outline-none focus:border-focused-border focus:bg-primary-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-3  px-3 w-full text-base md:text-lg border border-border"
              type="password"
              placeholder="Password"
            />
          </div>
          <button
            className="border overflow-hidden cursor-pointer max-h-[60px] rounded-md py-3 border-border w-full border-b-2 transition-[border] text-base md:text-lg text-black/70 dark:text-white capitalize px-3 bg-primary-background"
            type="submit"
          >
            <motion.div
              initial={{ y: 3 }}
              animate={{ y: loading ? -30 : 3 }}
              exit={{ y: 3 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center gap-3"
            >
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                Sign up
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingSpinner />
              </motion.span>
            </motion.div>
          </button>
        </form>
        <div className=" text-center pt-8 flex flex-col gap-2">
          <p className="text-base md:text-lg text-black/70 dark:text-white">
            Already have a BunnyBite account?
          </p>
          <Link href="/login">
            <button
              className="border cursor-pointer rounded-md py-3 border-border w-full border-b-2 transition-[border] text-black/70 dark:text-white text-base md:text-lg px-3  bg-primary-background"
              type="submit"
            >
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
