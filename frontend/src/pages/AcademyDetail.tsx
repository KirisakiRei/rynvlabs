import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { academyProjects } from "@/data/academy";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AcademyDetail = () => {
  const { id } = useParams();
  const project = academyProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold">Proyek Tidak Ditemukan</h1>
          <Link to="/academy" className="mt-4 inline-block text-primary hover:underline">Kembali ke Academy</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[40vh] min-h-[350px] overflow-hidden">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="mx-auto max-w-4xl">
              <Link to="/academy" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Archive
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-2xl font-bold sm:text-3xl md:text-4xl"
              >
                {project.title}
              </motion.h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-16">
          {/* Abstract */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Abstrak
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.abstract}</p>
          </motion.div>

          {/* Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Metodologi
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.methodology}</p>
          </motion.div>

          {/* Wiring Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Diagram Rangkaian
            </h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <img src={project.wiringDiagram} alt="Wiring Diagram" className="w-full object-cover" />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              Hasil Pengujian
            </h3>
            <div className="rounded-lg border border-border bg-secondary p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{project.results}</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AcademyDetail;
