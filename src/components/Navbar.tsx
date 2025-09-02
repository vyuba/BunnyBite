"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { clientAccount } from "@/app/lib/client-appwrite";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const checkUser = async () => {
      startTransition(async () => {
        const user = await clientAccount.get();
        console.log(user);
        if (user) setUser(user);
      });
    };
    checkUser();
  }, []);
  return (
    <div className="w-full fixed top-3 left-0 px-5 py-2 ">
      <div className="flex w-full justify-between items-center">
        <p className="text-sm md:text-base font-medium text-black/70 dark:text-white">
          BunnyBite
        </p>
        {isPending ? (
          <p>loading</p>
        ) : user ? (
          <Link href={"/dashboard"}>
            <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-4 hover:cursor-pointer bg-primary-background text-sm md:text-base py-2 rounded-lg">
              {user?.name} go to dashboard
            </button>
          </Link>
        ) : (
          <Link href={"/login"}>
            <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-4 hover:cursor-pointer bg-primary-background text-sm md:text-base py-2 rounded-lg">
              sign in
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
