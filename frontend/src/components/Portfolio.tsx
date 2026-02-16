import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";

const filters = [
  { label: "Semua", value: "all" },
  { label: "Software", value: "software" },
  { label: "IoT / Hardware", value: "iot" },
  { label: "Automation", value: "automation" },
];

const Portfolio = () => {
  const [active, setActive] = useState("all");
  const navigate = useNavigate();

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-3xl font-bold sm:text-4xl"
        >
          Showcase Proyek
        </motion.h2>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`rounded-full px-5 py-2 text-sm transition-all ${
                active === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-heading text-lg font-semibold">{p.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
