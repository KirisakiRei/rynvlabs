import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Cpu, Settings, FlaskConical, MessageCircle } from "lucide-react";

const categories = [
  { id: "web", label: "Web Development", icon: Monitor, waLabel: "Web Development" },
  { id: "iot", label: "IoT Hardware", icon: Cpu, waLabel: "IoT Hardware" },
  { id: "automation", label: "Automation", icon: Settings, waLabel: "Industrial Automation" },
  { id: "academy", label: "Academy / Riset", icon: FlaskConical, waLabel: "Research & Academy" },
];

const WHATSAPP_NUMBER = "6283192801660"; // Replace with actual number

const Contact = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");

  const selectedCategory = categories.find((c) => c.id === selected);

  const messagePreview = selected
    ? `Halo rynvlabs, saya${name ? ` ${name}` : ""} tertarik diskusi tentang *${selectedCategory?.waLabel}*. Bisakah kita membahas lebih lanjut?`
    : "Pilih kategori layanan di atas untuk memulai...";

  const waUrl = selected
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messagePreview)}`
    : "#";

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center font-heading text-3xl font-bold sm:text-4xl"
        >
          Mari Bangun Sesuatu
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 text-center text-muted-foreground"
        >
          Konfigurasikan pertanyaan Anda dan langsung terhubung via WhatsApp.
        </motion.p>

        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <input
            placeholder="Nama Anda (opsional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
          />
        </motion.div>

        {/* Selection grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-5 transition-all duration-200 ${
                selected === cat.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <cat.icon className={`h-6 w-6 ${selected === cat.id ? "text-primary" : ""}`} />
              <span className="text-xs font-medium text-center">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Message preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 rounded-lg border border-border bg-secondary p-5"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Preview Pesan
          </p>
          <p className="font-mono text-sm text-foreground leading-relaxed">
            {messagePreview}
          </p>
        </motion.div>

        {/* WhatsApp button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-3 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-300 ${
              selected
                ? "bg-[hsl(142,70%,40%)] text-white shadow-[0_0_30px_hsl(142,70%,40%,0.3)] hover:shadow-[0_0_40px_hsl(142,70%,40%,0.5)]"
                : "cursor-not-allowed bg-secondary text-muted-foreground"
            }`}
            onClick={(e) => !selected && e.preventDefault()}
          >
            <MessageCircle className="h-5 w-5" />
            Mulai Chat via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
