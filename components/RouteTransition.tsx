"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export function RouteTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const reduceMotion = useReducedMotion();

    const initial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 };
    const animate = { opacity: 1, y: 0 };
    const exit = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 };

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.main
                key={pathname}
                id="conteudo"
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="min-h-[calc(100vh-5rem)]"
            >
                {children}
            </motion.main>
        </AnimatePresence>
    );
}
