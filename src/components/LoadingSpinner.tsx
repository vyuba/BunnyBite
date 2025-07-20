"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function LoadingSpinner() {
  const [dashOffset, setDashOffset] = useState(60);

  useEffect(() => {
    const animate = () => {
      setDashOffset((prev) => {
        const newOffset = prev - 1;
        return newOffset <= 0 ? 100 : newOffset; // Loop back to 100 when reaching 0
      });
    };

    const interval = setInterval(animate, 20); // Adjust speed by changing interval
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <motion.svg
      className="-rotate-90 fill-none"
      width="20"
      height="20"
      viewBox="0 0 16 16"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        className="fill-none stroke-border"
        cx="8"
        cy="8"
        r="6.5"
        strokeWidth="2"
      />
      <motion.circle
        style={{
          strokeLinecap: "round",
        }}
        className="stroke-[#1A1A1A] fill-none"
        cx="8"
        cy="8"
        r="6.5"
        strokeWidth="3"
        pathLength="100"
        strokeDasharray="100"
        initial={{ strokeDashoffset: 60 }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 0, repeat: Infinity }} // Controlled by useEffect
      />
    </motion.svg>
  );
}
