import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import publicApi, { getImageUrl } from "@/lib/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Academy = () => {
  const [search, setSearch] = useState("");
  const [academyProjects, setAcademyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    publicApi.get('/academy')
      .then((res) => setAcademyProjects(res.data.data ?? res.data))
      .catch((err) => {
        console.error('[Academy] Failed to load projects:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = academyProjects.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(p.techStack) ? p.techStack : []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
                Research & Prototyping Archive
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Arsip proyek riset dan tugas akhir yang telah kami kembangkan bersama mahasiswa dan institusi akademik.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mb-12"
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Cari proyek atau teknologi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
              />
            </motion.div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary"
                  onClick={() => navigate(`/academy/${p.slug}`)}
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
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{p.year}</span>
                    </div>
                    <h3 className="mb-2 font-heading text-lg font-semibold">{p.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(p.techStack) ? p.techStack : []).map((t: string) => (
                        <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                    <button className="mt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80">
                      Lihat Study Case →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            )}

            {!loading && filtered.length === 0 && (
              <p className="text-center text-muted-foreground">Tidak ada proyek yang ditemukan.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Academy;
