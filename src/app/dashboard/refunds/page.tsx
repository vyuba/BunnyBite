"use client";
import { MagnifyingGlassIcon, SquareIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

const RefundPage = () => {
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
                  Amount
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
              <tr className="text-black/75 border-b border-[#E3E3E3]">
                <td className="text-nowrap text-left text-sm font-medium h-full p-2 bg-white flex items-center gap-2 sticky top-0 left-0">
                  <SquareIcon size={20} color="#303030" weight="regular" />
                  <span>#1000</span>
                </td>
                <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                  #1987
                </td>
                <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Katherine Batman
                </td>
                <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Aug 11 at 11:59 am
                </td>
                <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                  $70.00
                </td>
                <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Did not receive order
                </td>
                <td className="text-nowrap text-left text-sm font-medium h-full p-2">
                  Pending
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
export default RefundPage;
