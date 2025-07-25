import { motion } from "motion/react";

const SpinnerLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="flex flex-col gap-1 justify-center items-center">
        <motion.svg
          className="-rotate-90 fill-none"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <circle
            className="fill-none stroke-border"
            cx="8"
            cy="8"
            r="6.5"
            strokeWidth="3"
          ></circle>
          <motion.circle
            initial={{
              strokeDashoffset: 10,
              rotate: 0,
            }}
            animate={{
              strokeDashoffset: 30,
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 0.7,
            }}
            style={{
              strokeLinecap: "round",
            }}
            className="stroke-[#1A1A1A] fill-none"
            cx="8"
            cy="8"
            r="6.5"
            strokeWidth="2.4"
            pathLength="100"
            strokeDasharray="100"
          ></motion.circle>
        </motion.svg>
        <p className="capitalize text-xs md:text-sm">loading...</p>
      </span>
    </div>
  );
};

export default SpinnerLoader;
