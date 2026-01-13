import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportConnect",
  description: "Conectando arenas, atletas e o futuro do esporte.",
  metadataBase: new URL("http://localhost:3000"), // troque pelo domínio real em prod
  icons: { icon: "/logo3_sportconnect.png" },
  openGraph: {
    title: "SportConnect",
    description: "Conectando arenas, atletas e o futuro do esporte.",
    url: "https://sportconnect.dev",
    siteName: "SportConnect",
    images: [{ url: "/logo_sportconnect.png", width: 800, height: 600, alt: "SportConnect" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportConnect",
    description: "Conectando arenas, atletas e o futuro do esporte.",
    images: ["/logo_sportconnect.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#007ACC" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#2D2F33]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
