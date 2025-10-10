"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] z-50 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-6 md:px-10">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo4_sportconnect.png"
                        alt="SportConnect"
                        width={210}
                        height={90}
                        className="object-contain drop-shadow-md hover:scale-[1.03] transition-transform"
                        priority
                    />
                </Link>

                {/* Menu Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-[15px] text-[#2B2E33] font-medium">
                    <a href="#solucoes" className="hover:text-[#0098E8] transition">Soluções</a>
                    <a href="#sobre" className="hover:text-[#0098E8] transition">Sobre</a>
                    <a href="#contato" className="hover:text-[#0098E8] transition">Contato</a>
                </nav>

                {/* Botões */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="bg-[#0098E8] hover:bg-[#005D9C] text-white text-sm px-4 py-[6px] rounded-md shadow-sm transition-all"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/arena/login"
                        className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#2B2E33] text-sm px-4 py-[6px] rounded-md shadow-sm transition-all"
                    >
                        Entrar como Arena
                    </Link>
                </div>

                {/* Mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-[#0098E8] focus:outline-none"
                    aria-label="Abrir menu"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {menuOpen && (
                <div className="bg-white border-t border-gray-100 md:hidden shadow-md">
                    <nav className="flex flex-col items-center gap-4 py-5 text-[#2B2E33] font-medium">
                        <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
                        <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
                        <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>

                        <div className="flex flex-col gap-3 mt-3 w-[80%]">
                            <Link
                                href="/login"
                                className="w-full bg-[#0098E8] hover:bg-[#005D9C] text-white text-center py-2 rounded-md text-sm"
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/arena/login"
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 rounded-md text-sm"
                            >
                                Entrar como Arena
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
