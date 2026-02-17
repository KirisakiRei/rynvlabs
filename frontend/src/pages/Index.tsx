import { useEffect, useState } from "react";
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
import publicApi from "@/lib/publicApi";

interface LandingSection {
  id: number;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  content: any;
  isVisible: boolean;
  sortOrder: number;
}

const Index = () => {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .get("/landing-sections")
      .then((res) => {
        const data = res.data.data ?? res.data;
        // Filter only visible sections and sort by sortOrder
        const visibleSections = data
          .filter((s: LandingSection) => s.isVisible)
          .sort((a: LandingSection, b: LandingSection) => a.sortOrder - b.sortOrder);
        setSections(visibleSections);
      })
      .catch((err) => {
        console.error("[Index] Failed to load landing sections:", err.message);
        // If API fails, show all sections as fallback
        setSections([
          { sectionKey: "hero", isVisible: true } as LandingSection,
          { sectionKey: "tech-ticker", isVisible: true } as LandingSection,
          { sectionKey: "services", isVisible: true } as LandingSection,
          { sectionKey: "product", isVisible: true } as LandingSection,
          { sectionKey: "portfolio", isVisible: true } as LandingSection,
          { sectionKey: "academy", isVisible: true } as LandingSection,
          { sectionKey: "process", isVisible: true } as LandingSection,
          { sectionKey: "contact", isVisible: true } as LandingSection,
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Map section keys to components
  const renderSection = (section: LandingSection) => {
    const key = section.id || section.sectionKey;
    switch (section.sectionKey) {
      case "hero":
        return <Hero key={key} />;
      case "tech-ticker":
        return <TechTicker key={key} />;
      case "services":
        return <Services key={key} />;
      case "product":
        return <Product key={key} />;
      case "portfolio":
        return <Portfolio key={key} />;
      case "academy":
        return <AcademyShowcase key={key} />;
      case "process":
        return <Process key={key} />;
      case "contact":
        return <Contact key={key} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>{sections.map((section) => renderSection(section))}</main>
      <Footer />
    </div>
  );
};

export default Index;
