import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import publicApi, { getImageUrl } from "@/lib/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicIcon from "@/components/DynamicIcon";

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  image: string | null;
  features: { icon: string; title: string; desc: string }[];
  stats: { label: string; value: string }[];
}

const ITEMS_PER_PAGE = 4;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    publicApi
      .get("/products")
      .then((res) => {
        setProducts(res.data.data ?? res.data);
      })
      .catch((err) => {
        console.error("[Products] Failed to load:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paged = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-20">
          {/* Circuit pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-products" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M 20 60 H 50 V 30 H 70 V 60 H 100" stroke="currentColor" fill="none" strokeWidth="0.5" />
                  <path d="M 60 20 V 50 H 90 V 70 H 60 V 100" stroke="currentColor" fill="none" strokeWidth="0.5" />
                  <circle cx="50" cy="60" r="2" fill="currentColor" />
                  <circle cx="70" cy="60" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-products)" className="text-foreground" />
            </svg>
          </div>

          <div className="mx-auto max-w-7xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Our Products
              </p>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Solusi Siap Deploy
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed">
                Produk-produk IoT dan automation yang telah kami kembangkan, 
                siap diintegrasikan ke dalam ekosistem bisnis Anda.
              </p>
            </motion.div>
          </div>

          {/* Decorative line */}
          <div className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </section>

        {/* Products List */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-muted-foreground">Belum ada produk yang dipublikasikan.</p>
              </div>
            ) : (
              <>
                <div className="space-y-16">
                  {paged.map((product, idx) => {
                    const globalIdx = (page - 1) * ITEMS_PER_PAGE + idx;
                    const isReversed = globalIdx % 2 === 1;
                    const features = Array.isArray(product.features) ? product.features : [];
                    const stats = Array.isArray(product.stats) ? product.stats : [];

                    return (
                      <motion.article
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7, delay: idx * 0.1 }}
                        className="group relative"
                      >
                        <div
                          className={`flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.06)] ${
                            isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                          }`}
                        >
                          {/* Image */}
                          <div className="relative h-64 overflow-hidden lg:h-auto lg:w-[42%] flex-shrink-0">
                            {product.image ? (
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.title}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <span className="text-muted-foreground/30 font-heading text-6xl font-bold">
                                  {product.title.charAt(0)}
                                </span>
                              </div>
                            )}
                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-${isReversed ? "l" : "r"} from-transparent to-card/20`} />
                            
                            {/* Category badge */}
                            {product.category && (
                              <div className="absolute left-4 top-4">
                                <span className="rounded-sm bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                                  {product.category}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                            {/* Title & Description */}
                            <div className="mb-6">
                              <h2 className="mb-3 font-heading text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                                {product.title}
                              </h2>
                              <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                {product.description}
                              </p>
                            </div>

                            {/* Quick Stats */}
                            {stats.length > 0 && (
                              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {stats.slice(0, 4).map((stat) => (
                                  <div
                                    key={stat.label}
                                    className="rounded-sm border border-border/50 bg-background/50 px-3 py-2.5 text-center"
                                  >
                                    <p className="font-heading text-lg font-bold text-primary leading-none">
                                      {stat.value}
                                    </p>
                                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                      {stat.label}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Key Features */}
                            {features.length > 0 && (
                              <div className="mb-8 flex flex-wrap gap-2">
                                {features.slice(0, 3).map((f) => (
                                  <div
                                    key={f.title}
                                    className="flex items-center gap-2 rounded-sm border border-border/50 bg-secondary/50 px-3 py-1.5"
                                  >
                                    <DynamicIcon name={f.icon || "Zap"} className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-medium text-foreground">{f.title}</span>
                                  </div>
                                ))}
                                {features.length > 3 && (
                                  <span className="flex items-center px-3 py-1.5 text-xs text-muted-foreground">
                                    +{features.length - 3} lainnya
                                  </span>
                                )}
                              </div>
                            )}

                            {/* CTA */}
                            <div>
                              <button
                                onClick={() => navigate(`/products/${product.slug}`)}
                                className="group/btn inline-flex items-center gap-3 rounded-sm border border-primary bg-transparent px-6 py-3 text-sm font-heading font-semibold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                              >
                                Lihat Detail
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Product index number */}
                        <div className={`absolute -top-3 ${isReversed ? 'right-6 lg:right-auto lg:left-6' : 'right-6'} z-10`}>
                          <span className="font-heading text-7xl font-bold text-foreground/[0.03] leading-none select-none">
                            {String(globalIdx + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 flex items-center justify-center gap-4"
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-10 w-10 rounded-sm text-sm font-heading font-semibold transition-all ${
                            page === p
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground"
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
