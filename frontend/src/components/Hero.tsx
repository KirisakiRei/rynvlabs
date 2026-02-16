import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
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
          Menjembatani Logika Digital
          <br />
          dengan Realitas Fisik
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Spesialis dalam High-Performance Software, IoT Solutions, dan Industrial Automation.
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
            onClick={() => scrollTo("#services")}
          >
            Jelajahi Solusi
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary px-8 py-6 text-base font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => navigate("/academy")}
          >
            Research Academy
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
