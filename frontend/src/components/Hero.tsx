import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  section?: {
    title: string;
    subtitle: string | null;
    content: {
      ctaPrimary?: { text: string; link: string };
      ctaSecondary?: { text: string; link: string };
    };
  };
}

const Hero = ({ section }: HeroProps) => {
  const navigate = useNavigate();

  // Use section data or fallback to defaults
  const title = section?.title || "Menjembatani Logika Digital\ndengan Realitas Fisik";
  const subtitle = section?.subtitle || "Spesialis dalam High-Performance Software, IoT Solutions, dan Industrial Automation.";
  const ctaPrimary = section?.content?.ctaPrimary || { text: "Jelajahi Solusi", link: "#services" };
  const ctaSecondary = section?.content?.ctaSecondary || { text: "Research Academy", link: "/academy" };

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else if (href.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href.substring(1))?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(href);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Circuit pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 10 50 H 40 V 20 H 60 V 50 H 90" stroke="currentColor" fill="none" strokeWidth="0.5" />
              <path d="M 50 10 V 40 H 80 V 60 H 50 V 90" stroke="currentColor" fill="none" strokeWidth="0.5" />
              <circle cx="40" cy="50" r="2" fill="currentColor" />
              <circle cx="60" cy="50" r="2" fill="currentColor" />
              <circle cx="50" cy="40" r="2" fill="currentColor" />
              <circle cx="50" cy="60" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-foreground" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < title.split("\n").length - 1 && <br />}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-primary px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            onClick={() => scrollTo(ctaPrimary.link)}
          >
            {ctaPrimary.text}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary px-8 py-6 text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => scrollTo(ctaSecondary.link)}
          >
            {ctaSecondary.text}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
