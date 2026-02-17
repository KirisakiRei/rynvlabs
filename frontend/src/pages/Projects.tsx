import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X as XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import publicApi, { getImageUrl } from "@/lib/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Custom Tech Stack Filter Dropdown */
function TechStackFilter({ techStacks, active, onChange }: { techStacks: string[]; active: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = search
    ? techStacks.filter((t) => t.toLowerCase().includes(search.toLowerCase()))
    : techStacks;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/50 transition-colors min-w-[200px] justify-between"
      >
        <span className={active === 'all' ? 'text-muted-foreground' : 'text-foreground'}>
          {active === 'all' ? 'Semua Tech Stack' : active}
        </span>
        <div className="flex items-center gap-1">
          {active !== 'all' && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange('all'); }}
              className="p-0.5 rounded-full hover:bg-muted transition-colors"
            >
              <XIcon className="h-3 w-3 text-muted-foreground" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                placeholder="Cari tech stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            <button
              onClick={() => { onChange('all'); setOpen(false); setSearch(''); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                active === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-secondary'
              }`}
            >
              Semua Tech Stack
            </button>
            {filtered.map((t) => (
              <button
                key={t}
                onClick={() => { onChange(t); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  active === t ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-secondary'
                }`}
              >
                {t}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                Tidak ditemukan
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Projects = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTech, setActiveTech] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<{ label: string; value: string }[]>([{ label: 'Semua', value: 'all' }]);
  const navigate = useNavigate();

  useEffect(() => {
    publicApi.get('/projects').then((res) => {
      setProjects(res.data.data ?? res.data);
    }).catch((err) => {
      console.error('[Projects] Failed to load projects:', err.message);
    });

    publicApi.get('/categories').then((res) => {
      const cats = (res.data.data ?? res.data) as any[];
      const projectCats = cats.filter((c: any) => c.type === 'PROJECT');
      setCategoryFilters([
        { label: 'Semua', value: 'all' },
        ...projectCats.map((c: any) => ({ label: c.name, value: c.slug })),
      ]);
    }).catch(() => {});
  }, []);

  const allTechStacks = useMemo(() => {
    const stacks = projects.flatMap((p: any) => Array.isArray(p.techStack) ? p.techStack : []);
    return Array.from(new Set(stacks)).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p: any) => {
      const matchSearch =
        search === "" ||
        (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "all" || (p.category || '').toLowerCase() === activeCategory.toLowerCase();
      const ts = Array.isArray(p.techStack) ? p.techStack : [];
      const matchTech = activeTech === "all" || ts.includes(activeTech);
      return matchSearch && matchCategory && matchTech;
    });
  }, [search, activeCategory, activeTech, projects]);

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

              {/* Tech stack filter */}
              <TechStackFilter
                techStacks={allTechStacks}
                active={activeTech}
                onChange={setActiveTech}
              />
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
                  onClick={() => navigate(`/projects/${p.slug}`)}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.title || ''}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-heading text-lg font-semibold">{p.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(p.techStack) ? p.techStack : []).map((t: string) => (
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
