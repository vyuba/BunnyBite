"use client";
import { motion } from "motion/react";
import LoadingSpinner from "./LoadingSpinner";

const buttonStyles = {
  primary:
    "bg-[#303030] border border-[#4A4A4A] text-white border-b-2 hover:border-b hover:border-t-2",
  secondary:
    "border border-border border-b-2 text-black/70 hover:border-t-2 hover:border-b bg-[var(--background)]",
  tertiary:
    "border border-border border-b-2 transition-[border] text-black/70 bg-white",
  ghost: "bg-transparent hover:bg-[#F7F7F7]",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  ko: "bg-black text-white uppercase tracking-wider hover:bg-red-600 transition",
};

const Button = ({
  label,
  variant,
  customStyling,
  action,
  loading = false,
}: {
  label: string;
  variant: keyof typeof buttonStyles;
  customStyling?: string;
  action?: () => void;
  loading?: boolean;
}) => {
  return (
    <button
      onClick={action}
      className={`px-3 cursor-pointer ${buttonStyles[variant]} ${
        customStyling || ""
      } text-sm py-2 rounded-lg transition-all max-h-[40px]`}
    >
      <motion.div
        initial={{ y: 3 }}
        animate={{ y: loading && loading ? -30 : 3 }}
        exit={{ y: 3 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center gap-3"
      >
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {label}
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
  );
};

export default Button;
