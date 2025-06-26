import { motion } from "motion/react";

const ToolKit = ({ title, index, isHovered, isToolKit }) => {
  return (
    <motion.div
      initial={{ opacity: index === isHovered && isToolKit ? 1 : 0 }}
      animate={{ opacity: index === isHovered && isToolKit ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className="fixed w-fit z-[9000] py-2 px-3 rounded-md bg-[#EBEBEB] left-[65px] border border-[#E3E3E3]"
    >
      {title}
    </motion.div>
  );
};
export default ToolKit;
