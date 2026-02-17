import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import publicApi, { getImageUrl } from "@/lib/publicApi";

const Portfolio = () => {
  const [active, setActive] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<{ label: string; value: string }[]>([{ label: 'Semua', value: 'all' }]);
  const navigate = useNavigate();

  useEffect(() => {
    publicApi.get('/projects').then((res) => {
      setProjects(res.data.data ?? res.data);
    }).catch((err) => {
      console.error('[Portfolio] Failed to load projects:', err.message);
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

  const filtered = active === "all" ? projects : projects.filter((p) => (p.category || '').toLowerCase() === active.toLowerCase());
  const displayed = filtered.slice(0, 6);

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
          {categoryFilters.map((f) => (
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
          {displayed.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                    <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Lihat Semua Proyek
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
