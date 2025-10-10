export default function PassosSection() {
    const passos = [
        { num: "1", titulo: "Cadastre sua Arena", desc: "Preencha informações básicas da sua quadra e horários disponíveis." },
        { num: "2", titulo: "Configure Reservas", desc: "Defina preços, modalidades e horários de funcionamento." },
        { num: "3", titulo: "Comece a Vender", desc: "Receba reservas e pagamentos automaticamente pela plataforma." },
    ];

    return (
        <section className="bg-[#F9FBFD] py-20 text-center">
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-12">Como funciona</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
                {passos.map((p, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-8 flex-1"
                    >
                        <div className="w-10 h-10 flex items-center justify-center bg-[#0098E8] text-white rounded-full mx-auto mb-4 font-bold">
                            {p.num}
                        </div>
                        <h3 className="text-lg font-semibold text-[#2B2E33] mb-2">{p.titulo}</h3>
                        <p className="text-gray-600 text-sm">{p.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
