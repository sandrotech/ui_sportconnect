export default function MetricasSection() {
    const metricas = [
        { numero: "120+", titulo: "Arenas conectadas" },
        { numero: "25K+", titulo: "Reservas realizadas" },
        { numero: "18K+", titulo: "Jogadores cadastrados" },
    ];

    return (
        <section className="bg-[#F9FBFD] py-20 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                {metricas.map((m, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <h3 className="text-4xl font-extrabold text-[#0098E8]">{m.numero}</h3>
                        <p className="text-gray-600 mt-2 font-medium">{m.titulo}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
