import Image from "next/image";

export default function MockupSection() {
    return (
        <section className="py-20 bg-white flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-6">
                Um painel moderno e fácil de usar
            </h2>
            <p className="text-gray-600 mb-10 max-w-2xl">
                Visualize suas reservas, clientes e finanças em um único lugar.
            </p>

            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                    src="/mockup_dashboard.png"
                    alt="Painel SportConnect"
                    width={1200}
                    height={700}
                    className="object-cover w-full"
                />
            </div>
        </section>
    );
}
