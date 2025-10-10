import Image from "next/image";

export default function HeroSection() {
    return (
        <section
            id="inicio"
            className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-40 pb-20 gap-10"
        >
            <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#2B2E33] leading-tight">
                    Conectando{" "}
                    <span className="text-[#0098E8]">arenas, atletas</span> e o futuro do
                    esporte.
                </h1>
                <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                    Uma plataforma completa para gestão esportiva: cadastre arenas,
                    agende partidas, gerencie equipes e torneios com tecnologia de ponta.
                </p>

                <button className="mt-8 bg-[#0098E8] hover:bg-[#005D9C] text-white px-6 py-3 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition">
                    Solicitar demonstração
                </button>
            </div>

            <div className="flex justify-center md:justify-end w-full md:w-auto">
                <Image
                    src="/logo_sportconnect.png"
                    alt="SportConnect símbolo"
                    width={500}
                    height={500}
                    className="object-contain drop-shadow-md hover:scale-[1.05] transition-transform"
                />
            </div>
        </section>
    );
}
