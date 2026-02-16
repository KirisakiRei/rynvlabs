import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gauge, Cloud, Activity, Wifi, Shield, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productImage from "@/assets/product-smart-scale.jpg";

const stats = [
  { label: "Presisi", value: "±0.1g" },
  { label: "Latency", value: "<50ms" },
  { label: "Konektivitas", value: "WiFi" },
  { label: "Daya", value: "12V DC" },
];

const features = [
  { icon: Gauge, title: "High Precision", desc: "Load cells terkalibrasi dengan akurasi ±0.1g, cocok untuk aplikasi industri yang membutuhkan pengukuran presisi tinggi." },
  { icon: Cloud, title: "Cloud Integration", desc: "Sinkronisasi data real-time via MQTT dan WebSocket. Dashboard cloud untuk monitoring dari mana saja." },
  { icon: Activity, title: "Live Monitoring", desc: "Dashboard real-time dengan grafik tren, alert otomatis, dan riwayat data untuk analisis mendalam." },
  { icon: Wifi, title: "Wireless Connectivity", desc: "WiFi-enabled dengan dukungan OTA firmware updates. Tidak perlu kabel untuk konfigurasi dan maintenance." },
  { icon: Shield, title: "Industrial Grade", desc: "Enclosure aluminum alloy tahan korosi. Dirancang untuk lingkungan industri dengan standar IP65." },
  { icon: Zap, title: "Low Power", desc: "Konsumsi daya rendah dengan mode sleep otomatis. Mendukung operasi 24/7 dengan sumber daya 12V DC." },
];

const ProductDetail = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img src={productImage} alt="Smart Scales" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="mx-auto max-w-5xl">
              <Link to="/#products" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl"
              >
                Smart Scales
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 max-w-2xl text-muted-foreground"
              >
                Sistem penimbangan IoT industrial-grade dengan konektivitas cloud, dirancang untuk presisi tinggi.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, i) => (
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

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Latar Belakang</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Industri akuakultur dan manufaktur membutuhkan sistem penimbangan yang akurat, tahan air, dan dapat dimonitor secara remote. Solusi konvensional tidak memiliki konektivitas cloud dan analitik data yang memadai untuk pengambilan keputusan berbasis data.
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Solusi Teknis</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Kami merancang Smart Scales dengan enclosure aluminum alloy, empat load cells HX711 dalam konfigurasi Wheatstone bridge, dan mikrokontroler ESP32 dengan Kalman filtering. Data dikirim via MQTT ke cloud dashboard untuk monitoring dan analytics real-time.
              </p>
            </div>
          </div>

          {/* Features grid */}
          <div className="mt-16">
            <h3 className="mb-8 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Fitur Utama</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <f.icon className="mb-3 h-6 w-6 text-primary" />
                  <h4 className="mb-2 font-heading text-sm font-semibold">{f.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">Technical Specifications</h3>
            <div className="rounded-lg border border-border bg-secondary p-6 font-mono text-sm">
              <p className="text-primary">// Smart Scales v2.0 Specifications</p>
              <p className="text-muted-foreground">Microcontroller: ESP32-WROOM-32D</p>
              <p className="text-muted-foreground">Load Cell: 4x HX711 (Wheatstone Bridge)</p>
              <p className="text-muted-foreground">Connectivity: WiFi 802.11 b/g/n + MQTT</p>
              <p className="text-muted-foreground">Power: 12V DC, 500mA max</p>
              <p className="text-muted-foreground">Precision: ±0.1g (calibrated)</p>
              <p className="text-muted-foreground">Latency: &lt;50ms (sensor to cloud)</p>
              <p className="text-muted-foreground">Enclosure: Aluminum Alloy, IP65</p>
              <p className="text-muted-foreground">Dimensions: 250 x 250 x 80mm</p>
              <p className="text-muted-foreground">Filter: Kalman (adaptive)</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
