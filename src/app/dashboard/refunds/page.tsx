"use client";
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
  SquareIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { clientDatabase } from "@/app/lib/client-appwrite";
import { Models, Query } from "appwrite";

const RefundPage = () => {
  const { shop } = useCounterStore((state) => state);
  const [refunds, setRefunds] =
    useState<Models.DocumentList<Models.Document>>(null);
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await clientDatabase.listDocuments(
          process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_REFUND_COLLECTION_ID!,
          [Query.equal("shopId", shop?.$id)]
        );

        setRefunds(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRefunds();
  }, [shop?.$id]);
  return (
    <div className="w-full h-screen">
      <motion.div className="w-full max-w-[996px] bg-primary-background mx-auto py-1.5 rounded-lg border border-border h-auto flex flex-col gap-1.5 ">
        <div className="px-1.5 py-1 text-sm mx-1.5 rounded-md  flex items-center gap-1">
          <MagnifyingGlassIcon
            size={17}
            color="var(--icon-background)"
            aria-hidden="true"
            weight="bold"
          />
          <input
            className="w-full outline-none  text-[var(--icon-background)]"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="w-full overflow-x-scroll pb-2">
          <table className="w-full bg-primary-background border-border">
            <thead className="px-2 w-full overflow-hidden text-black/70 dark:text-white">
              <tr className=" bg-tertiay-background border-y border-border">
                <th className="text-nowrap text-left text-sm font-medium h-full p-2 sticky gap-2 flex items-center top-0 left-0 bg-tertiay-background">
                  <SquareIcon
                    size={20}
                    color="var(--icon-background)"
                    weight="regular"
                  />
                  <span>Refund ID</span>
                </th>
                <th className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Order ID
                </th>
                <th className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Customer
                </th>
                <th className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Date
                </th>
                <th className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Reason
                </th>
                <th className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {refunds &&
                refunds.documents.map((refund, index) => (
                  <tr
                    key={refund?.$id}
                    className="text-black/75 dark:text-white/80 border-b border-border relative "
                  >
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2 bg-primary-background flex items-center gap-2 sticky top-0 left-0">
                      <SquareIcon
                        size={20}
                        color="var(--icon-background)"
                        weight="regular"
                      />
                      <span># {refund?.orderId} </span>
                    </td>
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                      # {refund?.orderId}
                    </td>
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                      {refund?.user_name}
                    </td>
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                      {new Date(refund?.$createdAt).toLocaleDateString(
                        "en-US",
                        { weekday: "short", year: "numeric", month: "numeric" }
                      )}
                    </td>
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                      {refund?.details}
                    </td>
                    <td className="text-nowrap text-left text-sm font-medium h-full  p-2 ">
                      <button className="flex gap-1 items-center cursor-pointer bg-tertiay-background hover:bg-[#f5f5f5] transiton-all rounded-2xl border  px-2 py-1 border-border">
                        <span className="inline-block w-[10px] h-[10px] rounded-[5px] border border-solid border-yellow-500 transition-colors duration-200 ease bg-yellow-400"></span>
                        <span>Pending</span>
                        <CaretDownIcon />
                      </button>
                      {index === 0 && (
                        <div className="absolute hidden capitalize w-full rounded-md overflow-hidden max-w-[150px] top-10 right-23 z-50 bg-primary-background border-none border-border">
                          <ul className="w-full overflow-hidden">
                            <li className="capitalize overflow-hidden">
                              <button className="flex overflow-hidden w-full gap-1 items-center cursor-pointer bg-white hover:bg-[#f5f5f5] transiton-all border  px-2 py-1.5 border-[#E3E3E3]">
                                <span className="inline-block w-[10px] h-[10px] rounded-[5px] border-none  border-red-600 transition-colors duration-200 ease bg-red-500"></span>
                                <span className="capitalize">
                                  Action needed
                                </span>
                              </button>
                            </li>
                            <li className="capitalize overflow-hidden">
                              <button className="flex overflow-hidden w-full gap-1 items-center cursor-pointer bg-white hover:bg-[#f5f5f5] transiton-all border  px-2 py-1.5 border-[#E3E3E3]">
                                <span className="inline-block w-[10px] h-[10px] rounded-[5px] border-none  border-yellow-500 transition-colors duration-200 ease bg-yellow-400"></span>
                                <span className="capitalize">pending</span>
                              </button>
                            </li>
                            <li className="capitalize overflow-hidden">
                              <button className="flex overflow-hidden w-full gap-1 items-center cursor-pointer bg-white hover:bg-[#f5f5f5] transiton-all border  px-2 py-1.5 border-[#E3E3E3]">
                                <span className="inline-block w-[10px] h-[10px] rounded-[5px] border-none  border-green-800 transition-colors duration-200 ease bg-green-700"></span>
                                <span className="capitalize">closed</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
export default RefundPage;
