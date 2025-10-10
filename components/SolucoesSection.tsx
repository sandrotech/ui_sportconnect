import { Users, BarChart3, Trophy } from "lucide-react";

export default function SolucoesSection() {
    return (
        <section id="solucoes" className="bg-[#F9FBFD] py-20 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-10">
                Soluções <span className="text-[#0098E8]">SportConnect</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6">
                <Card
                    icon={<Trophy size={28} />}
                    title="Gestão de Arenas"
                    text="Controle reservas, horários e disponibilidade das quadras de forma simples e eficiente."
                />
                <Card
                    icon={<Users size={28} />}
                    title="Gerenciamento de Jogadores"
                    text="Cadastre perfis, organize equipes e conecte atletas de diversas modalidades esportivas."
                />
                <Card
                    icon={<BarChart3 size={28} />}
                    title="Relatórios e Estatísticas"
                    text="Acompanhe indicadores e desempenho com dashboards interativos."
                />
            </div>
        </section>
    );
}

function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="bg-white shadow-sm hover:shadow-md transition-all rounded-2xl p-8 flex flex-col items-center text-center border border-gray-100 hover:-translate-y-1">
            <div className="text-[#0098E8] mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-[#2B2E33] mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
        </div>
    );
}
