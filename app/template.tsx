"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [barKey, setBarKey] = useState(0);

  useEffect(() => {
    setBarKey((k) => k + 1);
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <motion.div
        key={`bar-${barKey}`}
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#004ef9] via-[#6a7dfd] to-[#ff4b00] z-[100]"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </>
  );
}
