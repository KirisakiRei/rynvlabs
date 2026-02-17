import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import publicApi, { getImageUrl } from "@/lib/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicIcon from "@/components/DynamicIcon";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    publicApi.get(`/products/${slug}`)
      .then((res) => setProduct(res.data.data ?? res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold">Produk Tidak Ditemukan</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const stats = Array.isArray(product.stats) ? product.stats : [];
  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img src={getImageUrl(product.image)} alt={product.title || ''} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="mx-auto max-w-5xl">
              <Link to="/products" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl"
              >
                {product.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 max-w-2xl text-muted-foreground"
              >
                {product.description}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="border-y border-border bg-card">
            <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
              {stats.map((stat: any, i: number) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="border-r border-border p-6 text-center last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r"
                >
                  <p className="font-heading text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            {product.background && (
              <div>
                <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Latar Belakang</h3>
                <div className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.background }} />
              </div>
            )}
            {product.solution && (
              <div>
                <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Solusi Teknis</h3>
                <div className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.solution }} />
              </div>
            )}
          </div>

          {/* Features grid */}
          {features.length > 0 && (
            <div className="mt-16">
              <h3 className="mb-8 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Fitur Utama</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f: any, i: number) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg border border-border bg-card p-6"
                  >
                    <div className="mb-3 text-primary">
                      <DynamicIcon name={f.icon || '⚡'} size={24} />
                    </div>
                    <h4 className="mb-2 font-heading text-sm font-semibold">{f.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          {product.specs && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Technical Specifications</h3>
              <div className="rounded-lg border border-border bg-secondary p-6 font-mono text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.specs }} />
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
