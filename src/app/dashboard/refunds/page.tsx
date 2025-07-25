"use client";
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckSquareIcon,
  DotsThreeIcon,
  MagnifyingGlassIcon,
  MinusSquareIcon,
  SquareIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCounterStore } from "@/app/providers/counter-store-provider";
import { clientDatabase } from "@/app/lib/client-appwrite";
import { Models, Query } from "appwrite";
import Skeleton from "@/components/Skeleton";

const RefundPage = () => {
  const { shop } = useCounterStore((state) => state);
  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
        setRefunds(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRefunds();
  }, [shop?.$id]);

  const toggleChecked = (refund) => {
    if (isCheckedList.some((item) => item.id === refund?.$id)) {
      // Remove it if already checked
      setIsCheckedList((prev) =>
        prev.filter((item) => item.id !== refund?.$id)
      );
    } else {
      // Add it
      setIsCheckedList((prev) => [
        ...prev,
        { id: refund?.$id, isChecked: true },
      ]);
    }
  };
  return (
    <div className="w-full h-screen">
      <motion.div className="w-full max-w-[996px] bg-primary-background mx-auto py-1.5 rounded-lg border border-border h-auto flex flex-col gap-1.5 ">
        <div className="px-1.5 py-1 text-sm md:text-base mx-1.5 rounded-md  flex items-center gap-1">
          <MagnifyingGlassIcon
            size={17}
            color="var(--icon-background)"
            aria-hidden="true"
            weight="bold"
          />
          <input
            className="w-full outline-none text-[var(--icon-background)]"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="w-full overflow-x-scroll">
          <table className="w-full bg-primary-background border-border">
            <thead className="px-2 w-full overflow-hidden text-black/70 dark:text-white ">
              <tr className=" bg-tertiay-background border-y border-border relative">
                <th
                  className={`text-nowrap text-left text-sm font-medium h-full p-2  gap-2 flex items-center top-0 left-0 bg-tertiay-background ${
                    isCheckedList.length > 0
                      ? "absolute w-full justify-between"
                      : "sticky"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        if (isCheckedList.length === refunds.total) {
                          // Deselect all
                          setIsCheckedList([]);
                        } else {
                          // Select all
                          const allChecked = refunds.documents.map(
                            (refund) => ({
                              id: refund.$id,
                              isChecked: true,
                            })
                          );
                          setIsCheckedList(allChecked);
                        }
                      }}
                    >
                      {isCheckedList.length > 0 ? (
                        isCheckedList.length < refunds.total ? (
                          <MinusSquareIcon
                            size={20}
                            color="var(--icon-background)"
                            weight="fill"
                          />
                        ) : (
                          <CheckSquareIcon
                            size={20}
                            color="var(--icon-background)"
                            weight="fill"
                          />
                        )
                      ) : (
                        <SquareIcon
                          size={20}
                          color="var(--icon-background)"
                          weight="regular"
                        />
                      )}
                    </button>
                    <span className="text-sm capitalize font-medium">
                      {isCheckedList.length > 0
                        ? `${isCheckedList.length} selected fields`
                        : " Refund ID"}
                    </span>
                  </div>
                  {isCheckedList.length > 0 && (
                    <div className="w-full justify-between h-full  flex items-center  px-2 gap-1.5">
                      <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize px-2 md:px-3 hover:cursor-pointer text-nowrap bg-white dark:bg-black/40 text-xs md:text-sm py-1 rounded-md">
                        delete
                      </button>
                      <button className="border border-border border-b-2 text-black/70 dark:text-white capitalize py-[1px] md:py-0.5 px-0.5 hover:cursor-pointer text-nowrap bg-white dark:bg-black/40 text-xs md:text-sm rounded-md">
                        <DotsThreeIcon weight="bold" size={23} />
                      </button>
                    </div>
                  )}
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
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <tr
                      key={i}
                      className="text-black/75 dark:text-white/80 border-b border-border relative "
                    >
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2 bg-primary-background flex items-center gap-2 sticky top-0 left-0 cursor-pointer">
                        <Skeleton styling={`w-full h-6 rounded-xs`} />
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                        <Skeleton styling={`w-full h-6 rounded-xs`} />
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                        <Skeleton styling={`w-full h-6 rounded-xs`} />
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                        <Skeleton styling={`w-full h-6 rounded-xs`} />
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                        <Skeleton styling={`w-full h-6 rounded-xs`} />
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full  p-2 ">
                        <Skeleton styling={`w-full h-6 rounded-xs`} />
                      </td>
                    </tr>
                  ))
                : refunds &&
                  refunds.documents.map((refund, index) => (
                    <tr
                      key={refund?.$id}
                      className="text-black/75 dark:text-white/80 border-b border-border relative "
                    >
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2 bg-primary-background flex items-center gap-2 sticky top-0 left-0 cursor-pointer">
                        {isCheckedList.some(
                          (list) => list?.id === refund?.$id
                        ) ? (
                          <CheckSquareIcon
                            onClick={() => {
                              toggleChecked(refund);
                            }}
                            size={20}
                            color="var(--icon-background)"
                            weight="fill"
                          />
                        ) : (
                          <SquareIcon
                            onClick={() => {
                              toggleChecked(refund);
                            }}
                            size={20}
                            color="var(--icon-background)"
                            weight="regular"
                          />
                        )}
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
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                        {refund?.details}
                      </td>
                      <td className="text-nowrap text-left text-sm font-medium h-full  p-2 ">
                        <button className="flex gap-1 items-center cursor-pointer bg-tertiay-background hover:bg-secondary-background transiton-all rounded-2xl border  px-2 py-1 border-border">
                          <span className="inline-block w-[10px] h-[10px] rounded-[5px] border border-solid border-yellow-500 transition-colors duration-200 ease bg-yellow-400"></span>
                          <span>Pending</span>
                          <CaretDownIcon />
                        </button>
                        {index === 0 && (
                          <div className="absolute hidden capitalize w-full rounded-md overflow-hidden max-w-[150px] top-10 right-23 z-50 bg-primary-background border-none border-border">
                            <ul className="w-full overflow-hidden">
                              <li className="capitalize overflow-hidden">
                                <button className="flex overflow-hidden w-full gap-1 items-center cursor-pointer bg-white hover:bg-[#f5f5f5] transiton-all border  px-2 py-1.5 border-border">
                                  <span className="inline-block w-[10px] h-[10px] rounded-[5px] border-none  border-red-600 transition-colors duration-200 ease bg-red-500"></span>
                                  <span className="capitalize">
                                    Action needed
                                  </span>
                                </button>
                              </li>
                              <li className="capitalize overflow-hidden">
                                <button className="flex overflow-hidden w-full gap-1 items-center cursor-pointer bg-white hover:bg-[#f5f5f5] transiton-all border  px-2 py-1.5 border-border">
                                  <span className="inline-block w-[10px] h-[10px] rounded-[5px] border-none  border-yellow-500 transition-colors duration-200 ease bg-yellow-400"></span>
                                  <span className="capitalize">pending</span>
                                </button>
                              </li>
                              <li className="capitalize overflow-hidden">
                                <button className="flex overflow-hidden w-full gap-1 items-center cursor-pointer bg-white hover:bg-[#f5f5f5] transiton-all border  px-2 py-1.5 border-border">
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
        <div className="w-full py-2 px-3 flex items-center justify-between">
          <span className="text-sm text-black/70 dark:text-white capitalize">
            {isLoading ? (
              <Skeleton styling={`w-20 h-6 rounded-xs`} />
            ) : refunds.total > 0 ? (
              ` Refunds per page. Total: ${refunds?.total}`
            ) : (
              "No refunds available"
            )}
          </span>
          <span className="flex items-center w-fit h-full gap-0.5">
            <button className="bg-secondary-background transition-colors hover:bg-background cursor-pointer p-1.5 rounded-l-md">
              <CaretLeftIcon
                size={15}
                color="var(--icon-background)"
                aria-hidden="true"
                weight="bold"
              />
            </button>
            <button className="bg-secondary-background transition-colors hover:bg-background cursor-pointer p-1.5 rounded-r-md">
              <CaretRightIcon
                size={15}
                color="var(--icon-background)"
                aria-hidden="true"
                weight="bold"
              />
            </button>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
export default RefundPage;
