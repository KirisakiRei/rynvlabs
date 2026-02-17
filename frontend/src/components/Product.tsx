import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import publicApi, { getImageUrl } from "@/lib/publicApi";
import DynamicIcon from "@/components/DynamicIcon";

const Product = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.get('/products')
      .then((res) => {
        const products = res.data.data ?? res.data;
        if (products.length > 0) setProduct(products[0]);
      })
      .catch((err) => {
        console.error('[Product] Failed to load products:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="products" className="flex items-center justify-center px-6 py-24">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </section>
    );
  }

  if (!product) return null;

  const features = Array.isArray(product.features) ? product.features : [];
  const specs = product.specs || '';
  const stats = Array.isArray(product.stats) ? product.stats : [];

  return (
    <section id="products" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold sm:text-4xl"
        >
          Produk Unggulan
        </motion.h2>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-2 font-heading text-2xl font-bold sm:text-3xl">{product.title}</h3>
            <p className="mb-8 text-muted-foreground">
              {product.description}
            </p>

            {features.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {features.slice(0, 4).map((f: any, idx: number) => (
                  <div key={`${f.title}-${idx}`} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                    <div className="mt-0.5 shrink-0 text-primary">
                      <DynamicIcon name={f.icon || '⚡'} size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {stats.length > 0 && (
              <div className="mt-8 rounded-lg border border-border bg-secondary p-4 font-mono text-xs">
                <p className="text-primary">// Technical Specifications</p>
                {stats.map((s: any, i: number) => (
                  <p key={i} className="text-muted-foreground">{s.label}: {s.value}</p>
                ))}
              </div>
            )}

            <Button
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate(`/products/${product.slug}`)}
            >
              Lihat Detail Produk →
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <img src={getImageUrl(product.image)} alt={product.title || ''} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Product;
