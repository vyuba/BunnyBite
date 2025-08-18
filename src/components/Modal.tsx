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
        className={`fixed top-0 cursor-pointer left-0 w-full h-full bg-black/50 z-[9900]`}
      ></motion.div>
      <motion.div
        initial={{
          scale: isOpen ? 1 : 0.7,
          y: isOpen ? 0 : 100,
          opacity: 0,
          display: isOpen ? "block" : "none",
        }}
        animate={{
          scale: isOpen ? 1 : 0.7,
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 100,
          display: isOpen ? "block" : "none",
        }}
        exit={{ scale: 0.7, y: 0, opacity: 0, display: "none" }}
        transition={{
          //   delay: 0.3,
          duration: 0.1,
        }}
        className="fixed bottom-[50px] left-1/2 transform -translate-x-1/2  z-[10000] w-full max-w-[500px]  flex items-center justify-center px-3 "
      >
        <div className="bg-background w-full rounded-lg  overflow-hidden">
          <div className="flex justify-between py-2 px-2.5 bg-tertiay-background items-center border-b border-border">
            <h2 className="text-sm  md:text-[15px] font-medium">{title}</h2>
            <button
              className=" hover:bg-secondary-background p-1.5 rounded-sm cursor-pointer"
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
    </div>
  );
};

export default Modal;
