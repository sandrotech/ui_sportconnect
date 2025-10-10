import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";

export default function ArenasSection() {
    return (
        <section
            id="arenas"
            className="bg-[#F9FBFD] py-20 flex flex-col items-center text-center"
        >
            <h2 className="text-3xl font-bold text-[#2B2E33] mb-3">
                Arenas <span className="text-[#0098E8]">Parceiras</span>
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl">
                Conheça as arenas que já fazem parte do ecossistema{" "}
                <span className="text-[#0098E8] font-semibold">SportConnect</span>.
            </p>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all p-8 w-full max-w-5xl hover:-translate-y-1">
                {/* Logo + Nome */}
                <div className="flex flex-col md:flex-row items-center gap-8 text-left">
                    <div className="flex-shrink-0 w-40 h-40 relative mx-auto md:mx-0 drop-shadow-sm">
                        <Image
                            src="/logo_beachplay.png"
                            alt="Arena Beach Play"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-[#0098E8] mb-2">
                            Arena Beach Play
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Localizada em Fortaleza, a{" "}
                            <strong>Arena Beach Play</strong> é referência em esportes de
                            areia e eventos esportivos. Oferece infraestrutura moderna para{" "}
                            <strong>Beach Tennis</strong>, <strong>vôlei de praia</strong> e
                            um aconchegante espaço de lanchonete para atletas e visitantes.
                        </p>
                    </div>
                </div>

                {/* Galeria */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npcR_twV5pJ7qKmFcnjSRL0nRtwGteQiTyPgwTUKyETUg0uNBBFPc6kd8q6xKFcsaYRjgtOs97MGw79fCRNvYqcrK2EnsXvpyLV7jADfGM5STbU0JqpnbYxDuG55VAEN8wrlrkwWbxJiPE=s680-w680-h510-rw",
                        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrwP9-ERtMmYyGLiU_RYeOEMj4gkiENXlG_90f0GWsGB6t8Ipm4kYyP5Uhcej-lZ9LMsfYyT-LmrByFivmTjkv6x70kLa8ZLCdpsKRGk3UHLctBbBRb38-aAEzt2DcG6cmh4OWYOg8iR2_c=s680-w680-h510-rw",
                        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npGvmC-S1KlLYMEbv4mBfo5MG3JmxL9b8HIEc6un6iikkjzbbET_dBHSREHq3W02Q16jLKKMjj3VgcpXNSHJjLHLInbRwtuVdMJ2hF9GK_qYcGZ-eKRPAiLprcfrBlASm1GCAu9wy9I5Tkp=s680-w680-h510-rw",
                    ].map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`Arena Beach Play ${i + 1}`}
                            className="rounded-xl object-cover w-full h-64 shadow-sm hover:shadow-md transition"
                        />
                    ))}
                </div>

                {/* Info */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <InfoBox
                        icon={<MapPin className="text-[#0098E8] w-8 h-8 mb-3" />}
                        title="ENDEREÇO"
                        text={
                            <>
                                Av. Dr. Silas Munguba, Nº450 <br />
                                Parangaba, Fortaleza - CE <br />
                                60740-002
                            </>
                        }
                    />
                    <InfoBox
                        icon={<Phone className="text-[#0098E8] w-8 h-8 mb-3" />}
                        title="TELEFONE"
                        text={
                            <>
                                (85) 98714-9619 <br />
                                (85) 99959-7843 <br />
                                <span className="font-medium">WhatsApp</span>
                            </>
                        }
                    />
                    <InfoBox
                        icon={<Clock className="text-[#0098E8] w-8 h-8 mb-3" />}
                        title="FUNCIONAMENTO"
                        text={
                            <>
                                Segunda à Domingo <br />
                                Das 06:00 às 23:30
                            </>
                        }
                    />
                </div>

                {/* Mapa */}
                <div className="mt-14">
                    <h4 className="text-lg font-semibold text-[#2B2E33] mb-3">
                        Localização
                    </h4>
                    <div className="relative overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        <iframe
                            title="Mapa Arena Beach Play"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15924.16334278459!2d-38.518!3d-3.732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c748b4a6b3a3f1%3A0x8b60ea4df1f21e42!2sArena%20Beach%20Play!5e0!3m2!1spt-BR!2sbr!4v1733860000000!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="300"
                            loading="lazy"
                            className="border-0 grayscale-[20%] contrast-110"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoBox({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center">
            {icon}
            <h4 className="font-semibold text-[#2B2E33] text-lg mb-2">{title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
        </div>
    );
}
