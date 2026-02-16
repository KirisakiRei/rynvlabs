import { motion } from "framer-motion";
import { PenTool, Box, Plug, Rocket } from "lucide-react";

const steps = [
  { icon: PenTool, label: "Logic Design", desc: "Arsitektur & perencanaan" },
  { icon: Box, label: "Prototyping", desc: "Bangun & iterasi" },
  { icon: Plug, label: "Integration", desc: "Koneksi & pengujian" },
  { icon: Rocket, label: "Deployment", desc: "Peluncuran & monitoring" },
];

const Process = () => {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold sm:text-4xl"
        >
          Proses Engineering
        </motion.h2>

        <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-border sm:left-0 sm:top-6 sm:block sm:h-px sm:w-full" />
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative z-10 flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                <s.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="sm:text-center">
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
