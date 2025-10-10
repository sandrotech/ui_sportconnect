export default function DemoSection() {
    return (
        <section className="py-20 bg-white text-center">
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-6">
                Solicite uma demonstração
            </h2>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Experimente o SportConnect e veja como é fácil gerenciar sua arena.
            </p>

            <form className="max-w-lg mx-auto flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nome"
                    className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:border-[#0098E8] outline-none"
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:border-[#0098E8] outline-none"
                />
                <input
                    type="tel"
                    placeholder="Telefone"
                    className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:border-[#0098E8] outline-none"
                />
                <button className="bg-[#0098E8] hover:bg-[#005D9C] text-white font-medium rounded-md py-3 transition">
                    Solicitar agora
                </button>
            </form>
        </section>
    );
}
