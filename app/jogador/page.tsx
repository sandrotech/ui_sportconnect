"use client";

import Link from "next/link";

export default function JogadorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA]">
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold text-[#007ACC] mb-4">Bem-vindo!</h1>
                <p className="text-gray-700 mb-8">
                    Você entrou com sucesso na área do jogador.
                </p>
                <Link
                    href="/"
                    className="bg-[#007ACC] hover:bg-[#005FA3] text-white px-6 py-2 rounded-md transition-all"
                >
                    Voltar para o início
                </Link>
            </div>
        </div>
    );
}
