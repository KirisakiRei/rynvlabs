import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Clock, MapPin, ArrowRight, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicIcon from "@/components/DynamicIcon";
import publicApi from "@/lib/publicApi";
import { useEffect } from "react";

interface ContactCategory {
  icon?: string;
  label: string;
  waLabel: string;
}

const Contact = () => {
  const { settings } = useSiteSettings();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<ContactCategory[]>([]);
  const [contactSection, setContactSection] = useState<any>(null);

  useEffect(() => {
    publicApi
      .get("/landing-sections")
      .then((res) => {
        const sections = res.data.data ?? res.data;
        const contact = sections.find((s: any) => s.sectionKey === "contact");
        if (contact) {
          setContactSection(contact);
          setCategories(contact.content?.categories || []);
        }
      })
      .catch(() => {});
  }, []);

  const WHATSAPP_NUMBER = settings.wa_number;
  const heading = contactSection?.title || "Mari Bangun Sesuatu";
  const subtitle =
    contactSection?.subtitle ||
    "Konfigurasikan pertanyaan Anda dan langsung terhubung via WhatsApp.";

  const activeCat = categories.find((c) => c.label === selectedCategory);

  const messagePreview = selectedCategory
    ? `Halo rynvlabs, saya${name ? ` ${name}` : ""} tertarik diskusi tentang *${activeCat?.waLabel || selectedCategory}*. Bisakah kita membahas lebih lanjut?`
    : "";

  const waUrl = selectedCategory
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messagePreview)}`
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Halo rynvlabs${name ? `, saya ${name}` : ""}. Saya ingin berdiskusi tentang layanan Anda.`
      )}`;

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
                <pattern
                  id="circuit-contact"
                  x="0"
                  y="0"
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 60 H 50 V 30 H 70 V 60 H 100"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 60 20 V 50 H 90 V 70 H 60 V 100"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="0.5"
                  />
                  <circle cx="50" cy="60" r="2" fill="currentColor" />
                  <circle cx="70" cy="60" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#circuit-contact)"
                className="text-foreground"
              />
            </svg>
          </div>

          <div className="mx-auto max-w-7xl text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Get In Touch
              </p>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {heading}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>

          <div className="mx-auto mt-12 h-px max-w-xs bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </section>

        {/* Main Content */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Left Side: Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Info Cards */}
                <div className="space-y-4">
                  <div className="rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/30">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-foreground">WhatsApp</h3>
                        <p className="text-xs text-muted-foreground">Respon cepat</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      +{WHATSAPP_NUMBER}
                    </a>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/30">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-foreground">Email</h3>
                        <p className="text-xs text-muted-foreground">Untuk proposal & formal inquiry</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">info@rynvlabs.com</p>
                  </div>

                  <div className="rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary/30">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-foreground">Jam Kerja</h3>
                        <p className="text-xs text-muted-foreground">Senin - Sabtu</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">09:00 — 18:00 WIB</p>
                  </div>
                </div>

                {/* Tagline */}
                <div className="rounded-sm border border-border/50 bg-secondary/30 p-6">
                  <p className="font-mono text-xs text-primary mb-2">// response_time</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kami merespon pesan WhatsApp dalam waktu{" "}
                    <span className="text-foreground font-semibold">&lt; 2 jam</span> pada jam kerja. 
                    Untuk project urgent, silakan langsung hubungi via WhatsApp.
                  </p>
                </div>
              </motion.div>

              {/* Right Side: WhatsApp Configurator */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="rounded-sm border border-border bg-card p-8 lg:p-10">
                  <div className="mb-8">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                      Quick Connect via WhatsApp
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Pilih kategori layanan dan langsung terhubung dengan tim kami.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="mb-8">
                    <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nama Anda
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama Anda (opsional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="mb-8">
                    <label className="mb-3 block font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Kategori Layanan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat.label;
                        return (
                          <button
                            key={cat.label}
                            onClick={() =>
                              setSelectedCategory(isActive ? null : cat.label)
                            }
                            className={`flex flex-col items-center gap-2.5 rounded-sm border p-5 transition-all duration-200 ${
                              isActive
                                ? "border-primary bg-primary/10 text-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {cat.icon && (
                              <DynamicIcon
                                name={cat.icon}
                                className={`h-6 w-6 ${isActive ? "text-primary" : ""}`}
                              />
                            )}
                            <span className="text-xs font-medium text-center leading-tight">
                              {cat.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mb-8">
                    <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Preview Pesan
                    </label>
                    <div className="rounded-sm border border-border bg-background p-4">
                      <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                        {selectedCategory
                          ? messagePreview
                          : `Halo rynvlabs${name ? `, saya ${name}` : ""}. Saya ingin berdiskusi tentang layanan Anda.`}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/wa flex w-full items-center justify-center gap-3 rounded-sm bg-[hsl(142,70%,40%)] px-8 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[hsl(142,70%,35%)] hover:shadow-[0_0_30px_hsl(142,70%,40%,0.3)]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Mulai Chat via WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/wa:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Quick Service Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-20"
            >
              <div className="mb-10 text-center">
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                  Quick Actions
                </p>
                <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Langsung Terhubung
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Klik layanan di bawah untuk langsung chat via WhatsApp dengan pesan yang sudah disiapkan.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat, idx) => {
                  const quickMsg = `Halo rynvlabs${name ? `, saya ${name}` : ""}. Saya tertarik dengan layanan *${cat.waLabel}*. Bisakah kita berdiskusi?`;
                  const quickUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(quickMsg)}`;

                  return (
                    <motion.a
                      key={cat.label}
                      href={quickUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + idx * 0.08 }}
                      className="group flex flex-col items-center gap-4 rounded-sm border border-border bg-card p-8 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.06)]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/10 transition-colors group-hover:bg-primary/20">
                        {cat.icon ? (
                          <DynamicIcon name={cat.icon} className="h-7 w-7 text-primary" />
                        ) : (
                          <Phone className="h-7 w-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Chat langsung →
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
