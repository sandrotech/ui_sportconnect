import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FuncionalidadesSection from "@/components/FuncionalidadesSection";
import MockupSection from "@/components/MockupSection";
import MetricasSection from "@/components/MetricasSection";
import DepoimentosSection from "@/components/DepoimentosSection";
import PassosSection from "@/components/PassosSection";
import DemoSection from "@/components/DemoSection";
import ArenasSection from "@/components/ArenasSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <HeroSection />
        <FuncionalidadesSection />
        <MockupSection />
        <MetricasSection />
        <DepoimentosSection />
        <PassosSection />
        <DemoSection />
        <ArenasSection />
      </main>
      <Footer />
    </>
  );
}
