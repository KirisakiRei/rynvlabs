import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import publicApi, { getImageUrl } from "@/lib/publicApi";

const AcademyShowcase = () => {
  const navigate = useNavigate();
  const [latestProjects, setLatestProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.get('/academy')
      .then((res) => {
        const all = res.data.data ?? res.data;
        const sorted = [...all].sort((a: any, b: any) => (b.year ?? 0) - (a.year ?? 0)).slice(0, 3);
        setLatestProjects(sorted);
      })
      .catch((err) => {
        console.error('[AcademyShowcase] Failed to load projects:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="academy-showcase" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center font-heading text-3xl font-bold sm:text-4xl"
        >
          Proyek Tugas Akhir
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground"
        >
          Kolaborasi riset dan proyek tugas akhir bersama mahasiswa dan institusi akademik.
        </motion.p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestProjects.map((p: any, i: number) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(`/academy/${p.slug}`)}
              className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(p.image)}
                  alt={p.title || ''}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  {p.year}
                </span>
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
                <p className="mt-4 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                  Lihat Study Case →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/academy"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Lihat Semua Study Case
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademyShowcase;
