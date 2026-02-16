import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold">Proyek Tidak Ditemukan</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="mx-auto max-w-5xl">
              <Link to="/#portfolio" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Portfolio
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl"
              >
                {project.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-3 max-w-2xl text-muted-foreground"
              >
                {project.description}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
            {project.stats.map((stat, i) => (
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                Latar Belakang
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{project.challenge}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                Solusi Teknis
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{project.solution}</p>
            </motion.div>
          </div>

          {/* Deep dive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Technical Deep Dive
            </h3>
            <div className="rounded-lg border border-border bg-secondary p-6 font-mono text-sm leading-relaxed text-muted-foreground">
              {project.deepDive}
            </div>
          </motion.div>

          {/* Tech stack */}
          <div className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-4 py-1.5 text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Galeri
            </h3>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {project.gallery.map((img, i) => (
                <div key={i} className="mb-4 overflow-hidden rounded-lg border border-border">
                  <img src={img} alt={`${project.title} ${i + 1}`} className="w-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
