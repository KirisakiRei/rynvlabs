import { motion } from "framer-motion";
import { Monitor, Cpu, Settings, FlaskConical } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Digital Solutions",
    description: "Kami merancang Web Apps, SaaS Platforms, dan Mobile Applications yang dibangun untuk skala dan performa tinggi.",
    tags: ["React", "Laravel", "Node.js"],
  },
  {
    icon: Cpu,
    title: "IoT & Embedded",
    description: "Desain hardware kustom, pengembangan firmware, dan integrasi sensor untuk perangkat terkoneksi.",
    tags: ["ESP32", "MQTT", "Firmware"],
  },
  {
    icon: Settings,
    title: "Industrial Automation",
    description: "Pemrograman PLC, sistem SCADA, dan desain control panel untuk industri manufaktur dan proses.",
    tags: ["Siemens", "PLC", "HMI"],
  },
  {
    icon: FlaskConical,
    title: "Research & Prototyping",
    description: "Dukungan riset akademik, proof-of-concept builds, dan pengembangan MVP yang cepat.",
    tags: ["Prototyping", "R&D", "MVP"],
  },
];

const Services = () => {
  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold sm:text-4xl"
        >
          Apa yang Kami Rekayasa
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group cursor-default rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:bg-accent ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <s.icon className="mb-4 h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
              <h3 className="mb-2 font-heading text-lg font-semibold">{s.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{s.description}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
