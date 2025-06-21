"use client";
import { XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

const Modal = ({
  title,
  description,
  children,
  isOpen = false,
  onClose,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <div>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0, display: isOpen ? "block" : "none" }}
        animate={{
          opacity: isOpen ? 1 : 0,
          display: isOpen ? "block" : "none",
        }}
        exit={{ opacity: 0, display: "none" }}
        transition={
          {
            //   duration: 0.1,
          }
        }
        className={`fixed top-0 cursor-pointer left-0 w-full h-full bg-black/50 z-50`}
      ></motion.div>
      <motion.div
        initial={{
          scale: isOpen ? 1 : 0.7,
          opacity: 0,
          display: isOpen ? "block" : "none",
        }}
        animate={{
          scale: isOpen ? 1 : 0.7,
          opacity: isOpen ? 1 : 0,
          display: isOpen ? "block" : "none",
        }}
        exit={{ scale: 0.7, opacity: 0, display: "none" }}
        transition={{
          //   delay: 0.3,
          duration: 0.1,
        }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-[450px] rounded-lg  z-50 overflow-hidden"
      >
        <div className="flex justify-between p-2 bg-[#F7F7F7]  items-center border-b border-[#EBEBEB]">
          <h2 className="text-base font-medium">{title}</h2>
          <button
            className=" hover:bg-[#F7F7F7] p-1.5 rounded-sm cursor-pointer"
            onClick={onClose}
          >
            <XIcon size={17} />
          </button>
        </div>
        <div className="py-2">
          <p className="text-sm text-pretty text-black/70 w-full px-2 pb-2">
            {description}
          </p>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
