"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { getLoggedInUser } from "@/helpers/appwrite-helpers";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { clientAccount } from "../lib/client-appwrite";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Status } from "@/components/pages/RegisterPage";
import Image from "next/image";
import { SmileyXEyesIcon } from "@phosphor-icons/react";
// import { setJwtCookie } from "@/utils";

const LoginPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({
    message: null,
    type: null,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkUser = async () => {
      // const user = await getLoggedInUser();
      const user = await clientAccount.get();
      console.log(user);
      if (user) router.push("/dashboard");
    };
    checkUser();
  }, [router]);
  //SIGN IN USER WITH EMAIL AND PASSWORD
  async function signInWithEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    if (!password || !email) {
      setStatus({
        message: "Email and Password was not provided",
        type: "error",
      });
      throw new Error("Email and Password was not provided");
    }
    setLoading(true);
    toast.loading("Logging in...", {
      id: "Login",
    });
    try {
      const session = await clientAccount.createEmailPasswordSession(
        email as string,
        password as string
      );
      // const jwt = await clientAccount.createJWT();
      console.log(session);
      // console.log("jwt", jwt);
      // await setJwtCookie(jwt);
      setStatus({
        message: "Sucessfully Logged In",
        type: "success",
      });
      setLoading(false);
      toast.loading("Redirecting...", {
        id: "Login",
      });

      toast.success(status.message, {
        id: "Login",
      });
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      setStatus({
        message: "An error occurred.",
        type: "error",
      });
      toast.error(status.message, {
        id: "Login",
        icon: <SmileyXEyesIcon fill="#303030" />,
        description: error?.message,
      });
      console.error("Error:", error);
    } finally {
      // toast.dismiss("Login");
      setLoading(false);
    }
  }
  return (
    <div className=" w-full h-screen flex items-center justify-center bg-secondary-background px-4">
      <div className="flex flex-col w-full max-w-[400px]">
        <div className="flex flex-col gap-2 items-center justify-center pb-8">
          <div className="border hover:cursor-pointer size-10 border-[#4A4A4A] hover:border-b-2 transition-[border] text-black/70 dark:text-white capitalize  bg-[#303030] flex items-center justify-center text-sm  rounded-lg">
            <Image
              width={40}
              height={40}
              src={"/bunnyBite-logo.svg"}
              alt="BunnyBite Logo"
              className="p-1"
            />
          </div>
          <h1 className="text-center text-black/70 dark:text-white  text-lg md:text-xl font-medium">
            Sign in
          </h1>
        </div>
        <form
          className=" flex flex-col items-center w-full gap-5"
          onSubmit={signInWithEmail}
        >
          <div className="flex flex-col gap-2.5 w-full">
            <input
              id="email"
              name="email"
              className="bg-background text-[#6b6b6b] focus:bg-background focus:outline-none focus:border-border focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-3 px-3 w-full text-base md:text-lg border border-border"
              type="email"
              placeholder="Email address"
            />
            <input
              id="password"
              name="password"
              className="bg-background text-[#6b6b6b] focus:bg-background focus:outline-none focus:border-background focus-border-2 focus:ring focus:ring-border focus:ring-opacity-50 rounded-md py-3  px-3 w-full text-base md:text-lg border border-border"
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
                Sign in
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
        <p className="text-black/50 dark:text-white text-center font-medium mt-6">
          <Link className="" href="/forgotpassword">
            Forget your password?
          </Link>
        </p>
        <div className=" text-center pt-8 flex flex-col gap-2">
          <p className="text-base text-black/70 dark:text-white md:text-lg">
            Don&apos;t have a BunnyBite account?
          </p>
          <Link href="/register">
            <button
              className="border cursor-pointer rounded-md py-3 border-border w-full border-b-2 transition-[border] text-black/70 dark:text-white text-base md:text-lg px-3 bg-primary-background"
              type="submit"
            >
              Create an account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
