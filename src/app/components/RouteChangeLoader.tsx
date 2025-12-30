 "use client";
 import { useEffect, useState } from "react";
 import { useLocation } from "react-router-dom";
 import { AnimatePresence, motion } from "framer-motion";
 
 export function RouteChangeLoader() {
   const { pathname } = useLocation();
   const [show, setShow] = useState(false);
   useEffect(() => {
     setShow(true);
     const t = setTimeout(() => setShow(false), 700);
     return () => clearTimeout(t);
   }, [pathname]);
   return (
     <AnimatePresence>
       {show && (
         <motion.div
           initial={{ width: "0%" }}
           animate={{ width: "100%" }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.7, ease: "easeOut" }}
           className="fixed top-0 left-0 h-[3px] z-[60] bg-gradient-to-r from-[#004ef9] via-[#ff4b00] to-[#ff6b00] shadow-[0_0_18px_rgba(255,75,0,0.35)]"
         />
       )}
     </AnimatePresence>
   );
 }
