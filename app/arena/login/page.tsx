"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ArenaLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulação de login de teste
        setTimeout(() => {
            setLoading(false);
            router.push("/arena/dashboard"); // redireciona após login
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#EAF3FA] px-6">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-10 border border-gray-100">
                <div className="flex justify-center mb-10 mt-2">
                    <Image
                        src="/logo5_sportconnect.png"
                        alt="Logo SportConnect"
                        width={250}
                        height={90}
                        priority
                        className="object-contain"
                    />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#2D2F33] mb-10">
                    Login da Arena
                </h1>

                <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            E-mail da Arena
                        </label>
                        <input
                            type="email"
                            placeholder="Digite o e-mail da arena"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#007ACC] focus:outline-none text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#007ACC] focus:outline-none text-sm"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#007ACC] hover:bg-[#005FA3] text-white font-medium py-2 mt-3 transition-all"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-600 mt-8 space-y-2">
                    <Link href="#" className="hover:text-[#007ACC] block">
                        Esqueceu sua senha?
                    </Link>
                    <Link href="/" className="hover:text-[#007ACC] block">
                        ← Voltar para o site
                    </Link>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-8">
                © {new Date().getFullYear()} SportConnect — Portal de Arenas
            </p>
        </div>
    );
}
