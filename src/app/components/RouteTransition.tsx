"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

export function RouteTransition({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();
    const reduceMotion = useReducedMotion();

    const initial = reduceMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(6px)" };
    const animate = { opacity: 1, y: 0, filter: "blur(0px)" };
    const exit = reduceMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -6, filter: "blur(6px)" };

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.main
                key={pathname}
                id="conteudo"
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="min-h-[calc(100vh-5rem)]"
            >
                {children}
            </motion.main>
        </AnimatePresence>
    );
}
