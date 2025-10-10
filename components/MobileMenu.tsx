"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    // trava/destrava o scroll da página quando o menu está aberto
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = open ? "hidden" : original || "";
        return () => { document.body.style.overflow = original; };
    }, [open]);

    return (
        <>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                className="text-[#007ACC] text-2xl focus:outline-none relative z-[1001]"
                aria-label="Abrir menu"
            >
                <FaBars />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="fixed inset-0 bg-white z-[2000] flex flex-col"
                    >
                        {/* topo do menu */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-sm">
                            <Image src="/logo2_sportconnect.png" alt="SportConnect" width={120} height={35} priority />
                            <button
                                onClick={() => setOpen(false)}
                                className="text-[#007ACC] text-2xl"
                                aria-label="Fechar menu"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* links */}
                        <nav className="flex-1 flex flex-col items-center justify-center gap-8 text-[#2D2F33] font-medium text-lg">
                            <Link href="#solucoes" onClick={() => setOpen(false)} className="hover:text-[#007ACC]">Soluções</Link>
                            <Link href="#sobre" onClick={() => setOpen(false)} className="hover:text-[#007ACC]">Sobre</Link>
                            <Link href="#contato" onClick={() => setOpen(false)} className="hover:text-[#007ACC]">Contato</Link>
                        </nav>

                        {/* CTA inferior */}
                        <div className="px-8 pb-10">
                            <Button onClick={() => setOpen(false)} className="w-full bg-[#007ACC] hover:bg-[#005FA3] text-white text-base py-3 rounded-md shadow-md">
                                Entrar
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
