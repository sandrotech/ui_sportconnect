import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <Image
                src="/logo4_sportconnect.png"
                alt="SportConnect Loading"
                width={250}
                height={250}
                priority
            />
        </div>
    );
}
