import { motion } from "framer-motion";
import { Wifi, Cloud, Activity, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import productImage from "@/assets/product-smart-scale.jpg";

const features = [
  { icon: Gauge, label: "High Precision", desc: "Akurasi ±0.1g dengan load cells terkalibrasi" },
  { icon: Cloud, label: "Cloud Integration", desc: "Sinkronisasi data real-time via MQTT/WebSocket" },
  { icon: Activity, label: "Live Monitoring", desc: "Dashboard dengan trends dan alerts" },
  { icon: Wifi, label: "Wireless", desc: "WiFi-enabled dengan OTA firmware updates" },
];

const specs = [
  "// Technical Specifications",
  'Conn: MQTT/WebSocket',
  'Power: 12V DC',
  'Material: Aluminum Alloy',
  'Latency: <50ms',
  'Precision: ±0.1g',
  'Protocol: IEEE 802.11 b/g/n',
];

const Product = () => {
  const navigate = useNavigate();

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
            <h3 className="mb-2 font-heading text-2xl font-bold sm:text-3xl">Smart Scales</h3>
            <p className="mb-8 text-muted-foreground">
              Sistem penimbangan IoT industrial-grade dengan konektivitas cloud, dirancang untuk lingkungan yang membutuhkan presisi tinggi.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.label} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-border bg-secondary p-4 font-mono text-xs">
              {specs.map((line, i) => (
                <p key={i} className={i === 0 ? "text-primary" : "text-muted-foreground"}>
                  {line}
                </p>
              ))}
            </div>

            <Button
              className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/products/smart-scales")}
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
            <img src={productImage} alt="Smart Scales IoT Device" className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Product;
