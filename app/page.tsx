import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SolucoesSection from "@/components/SolucoesSection";
import ArenasSection from "@/components/ArenasSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <HeroSection />
        <SolucoesSection />
        <ArenasSection />
      </main>
      <Footer />
    </>
  );
}
