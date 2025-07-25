import { motion } from "motion/react";

const ToolKit = ({
  children,
  index,
  isHovered,
  isToolKit,
}: {
  children: React.ReactNode;
  index: number;
  isHovered: number;
  isToolKit: boolean;
}) => {
  return (
    <motion.div
      initial={{
        visibility: index === isHovered && isToolKit ? "visible" : "hidden",
        opacity: index === isHovered && isToolKit ? 1 : 0,
      }}
      animate={{
        visibility: index === isHovered && isToolKit ? "visible" : "hidden",
        opacity: index === isHovered && isToolKit ? 1 : 0,
      }}
      exit={{ opacity: 0, visibility: "hidden" }}
      className="fixed w-fit z-[9000] py-2 px-3 rounded-md text-black/70 dark:text-white/70 bg-secondary-background left-[65px] border border-border"
    >
      {children}
    </motion.div>
  );
};
export default ToolKit;
