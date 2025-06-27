"use client";
import { MagnifyingGlassIcon, SquareIcon } from "@phosphor-icons/react";
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
      <motion.div className="w-full max-w-[996px] bg-white mx-auto py-1.5 rounded-lg border border-[#E3E3E3] h-auto flex flex-col gap-1.5 ">
        <div className="px-1.5 py-1 text-sm mx-1.5 rounded-md  flex items-center gap-1">
          <MagnifyingGlassIcon
            size={17}
            className="text-black/50"
            aria-hidden="true"
            weight="bold"
          />
          <input
            className="w-full outline-none"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="w-full overflow-x-scroll pb-2">
          <table className="w-full bg-white border-[#E3E3E3]">
            <thead className="px-2 w-full overflow-hidden text-black/70">
              <tr className=" bg-[#F7F7F7] border-y border-[#E3E3E3]">
                <th className="text-nowrap text-left text-sm font-medium h-full p-2 sticky gap-2 flex items-center top-0 left-0 bg-[#F7F7F7]">
                  <SquareIcon size={20} color="#303030" weight="regular" />
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
                <th className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {refunds &&
                refunds.documents.map((refund) => (
                  <tr
                    key={refund?.$id}
                    className="text-black/75 border-b border-[#E3E3E3]"
                  >
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2 bg-white flex items-center gap-2 sticky top-0 left-0">
                      <SquareIcon size={20} color="#303030" weight="regular" />
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
                    <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                      Pending
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
