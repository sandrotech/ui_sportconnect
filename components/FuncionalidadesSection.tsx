import { CalendarCheck, CreditCard, BarChart3, Users, Bell } from "lucide-react";

export default function FuncionalidadesSection() {
    return (
        <section id="solucoes" className="bg-[#F9FBFD] py-20 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-10">
                Funcionalidades <span className="text-[#0098E8]">SportConnect</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl px-6">
                {[
                    { icon: <CalendarCheck size={28} />, title: "Reservas Online", desc: "Agende e gerencie quadras de qualquer lugar." },
                    { icon: <CreditCard size={28} />, title: "Gestão Financeira", desc: "Controle entradas, saídas e relatórios automáticos." },
                    { icon: <BarChart3 size={28} />, title: "Relatórios", desc: "Acompanhe o desempenho das arenas em tempo real." },
                    { icon: <Users size={28} />, title: "Jogadores & Times", desc: "Cadastre atletas, equipes e torneios facilmente." },
                    { icon: <Bell size={28} />, title: "Notificações", desc: "Envie alertas automáticos por WhatsApp ou e-mail." },
                ].map((f, i) => (
                    <div
                        key={i}
                        className="bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100"
                    >
                        <div className="text-[#0098E8] mb-3">{f.icon}</div>
                        <h3 className="text-lg font-semibold text-[#2B2E33] mb-2">{f.title}</h3>
                        <p className="text-gray-600 text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
