import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryFilters = [
  { label: "Semua", value: "all" },
  { label: "Software", value: "software" },
  { label: "IoT / Hardware", value: "iot" },
  { label: "Automation", value: "automation" },
];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTech, setActiveTech] = useState("all");
  const navigate = useNavigate();

  const allTechStacks = useMemo(() => {
    const stacks = projects.flatMap((p) => p.techStack);
    return Array.from(new Set(stacks)).sort();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      const matchTech = activeTech === "all" || p.techStack.includes(activeTech);
      return matchSearch && matchCategory && matchTech;
    });
  }, [search, activeCategory, activeTech]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
                Proyek Kami
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Jelajahi koleksi lengkap proyek yang telah kami kembangkan, dari software hingga IoT dan sistem otomasi industri.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mb-8"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Cari proyek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
              />
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setActiveCategory(f.value)}
                    className={`rounded-full px-5 py-2 text-sm transition-all ${
                      activeCategory === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Tech stack select */}
              <select
                value={activeTech}
                onChange={(e) => setActiveTech(e.target.value)}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                <option value="all">Semua Tech Stack</option>
                {allTechStacks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Results count */}
            <p className="mb-6 text-sm text-muted-foreground">
              Menampilkan {filtered.length} proyek
            </p>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="mt-8 text-center text-muted-foreground">
                Tidak ada proyek yang ditemukan.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
