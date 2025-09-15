"use client";
import { XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";

const Modal = ({
  title,
  description,
  children,
  isOpen = false,
  onClose,
  z_index_number = "99900",
  scale = 1,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  z_index_number?: string;
  scale?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, display: isOpen ? "block" : "none" }}
      animate={{
        opacity: isOpen ? 1 : 0,
        display: isOpen ? "block" : "none",
      }}
      exit={{ opacity: 0, display: "none" }}
      className={`z-[${z_index_number}] fixed inset-0`}
    >
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
        className={`absolute cursor-pointer w-full h-full   inset-0 bg-black/50`}
      ></motion.div>
      <motion.div
        initial={{
          scale: isOpen ? 1 : 0.7,
          y: isOpen ? 0 : 100,
          opacity: 0,
          display: isOpen ? "block" : "none",
        }}
        animate={{
          scale: isOpen ? scale : 0.7,
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 100,
          display: isOpen ? "block" : "none",
        }}
        exit={{ scale: 0.7, y: 0, opacity: 0, display: "none" }}
        transition={{
          //   delay: 0.3,
          duration: 0.1,
        }}
        className={`absolute bottom-[50px] left-1/2 transform -translate-x-1/2  w-full max-w-[500px]  flex items-center justify-center px-3 `}
      >
        <div className="bg-background w-full rounded-lg  overflow-hidden">
          <div className="flex justify-between py-2 px-2.5 bg-tertiay-background items-center border-b border-border">
            <h2 className="text-sm  md:text-[15px] font-medium text-black dark:text-white">
              {title}
            </h2>
            <button
              className=" hover:bg-secondary-background p-1.5 rounded-sm cursor-pointer text-black/70 dark:text-white"
              onClick={onClose}
            >
              <XIcon size={17} />
            </button>
          </div>
          <div className="py-2">
            <p className="text-sm text-pretty text-black/70 dark:text-white w-full px-2 pb-2">
              {description}
            </p>
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
