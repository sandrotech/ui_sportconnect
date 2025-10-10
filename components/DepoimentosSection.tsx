import Image from "next/image";

export default function DepoimentosSection() {
    const depoimentos = [
        {
            nome: "Lucas Almeida",
            texto: "O SportConnect transformou a forma como gerenciamos nossa arena. O sistema é prático e completo!",
            img: "/cliente1.jpg",
        },
        {
            nome: "Mariana Costa",
            texto: "A interface é incrível e o suporte sempre atencioso. A gestão nunca foi tão fácil.",
            img: "/cliente2.jpg",
        },
    ];

    return (
        <section className="py-20 bg-white text-center">
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-12">
                O que nossos clientes dizem
            </h2>

            <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto px-6">
                {depoimentos.map((d, i) => (
                    <div
                        key={i}
                        className="bg-[#F9FBFD] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center"
                    >
                        <Image
                            src={d.img}
                            alt={d.nome}
                            width={70}
                            height={70}
                            className="rounded-full mb-4 object-cover"
                        />
                        <p className="text-gray-600 mb-3">“{d.texto}”</p>
                        <span className="font-semibold text-[#0098E8]">{d.nome}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
