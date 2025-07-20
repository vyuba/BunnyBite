import { SetStateAction, useEffect, useRef } from "react";
import { motion } from "motion/react";

const PopOver = ({
  icon,
  children,
  isProfileClicked,
  setIsProfileClicked,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  isProfileClicked: boolean;
  setIsProfileClicked: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const inputRef = useRef(null);
  const PopUpref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      event.stopPropagation();
      if (
        PopUpref.current &&
        inputRef.current &&
        !(PopUpref.current as HTMLElement).contains(event.target as Node) &&
        !(inputRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsProfileClicked(!isProfileClicked);
      }
    }
    if (isProfileClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileClicked, setIsProfileClicked]);
  return (
    <>
      <button
        onClick={() => setIsProfileClicked(!isProfileClicked)}
        ref={inputRef}
        className={`${
          isProfileClicked
            ? " bg-[var(--background)]"
            : "hover:bg-[var(--background)]"
        }  transition-all flex items-center justify-center hover:cursor-pointer text-black/70 dark:text-white capitalize px-3  text-sm py-3 rounded-lg`}
      >
        {icon}
      </button>

      <motion.div
        ref={PopUpref}
        initial={{ y: 20, x: -50, opacity: 0, scale: 0 }}
        animate={{
          y: isProfileClicked ? 0 : -200,
          x: isProfileClicked ? 50 : 200,
          opacity: isProfileClicked ? 1 : 0,
          scale: isProfileClicked ? 1 : 0,
        }}
        exit={{ y: -200, x: 200, opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-14 z-[9000] right-20 w-full rounded-md bg-background border border-border  pb-1 max-w-[340px]"
      >
        {children}
      </motion.div>
    </>
  );
};
export default PopOver;
