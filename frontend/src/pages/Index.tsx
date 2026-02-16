import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechTicker from "@/components/TechTicker";
import Services from "@/components/Services";
import Product from "@/components/Product";
import Portfolio from "@/components/Portfolio";
import AcademyShowcase from "@/components/AcademyShowcase";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TechTicker />
        <Services />
        <Product />
        <Portfolio />
        <AcademyShowcase />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
