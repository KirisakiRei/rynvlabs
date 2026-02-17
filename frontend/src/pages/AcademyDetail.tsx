import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import publicApi, { getImageUrl } from "@/lib/publicApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const AcademyDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    publicApi.get(`/academy/${slug}`)
      .then((res) => setProject(res.data.data ?? res.data))
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

  if (notFound || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold">Proyek Tidak Ditemukan</h1>
          <Link to="/academy" className="mt-4 inline-block text-primary hover:underline">Kembali ke Academy</Link>
        </div>
      </div>
    );
  }

  const techStack = Array.isArray(project.techStack) ? project.techStack : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-[40vh] min-h-[350px] overflow-hidden">
          <img src={getImageUrl(project.image)} alt={project.title || ''} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="h-full w-full object-cover" />
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
                {techStack.map((t: string) => (
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
            <div className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: project.abstract || '' }} />
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
            <div className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: project.methodology || '' }} />
          </motion.div>

          {/* Wiring Diagram */}
          {project.wiringDiagram && (
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
                <img src={getImageUrl(project.wiringDiagram)} alt="Wiring Diagram" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="w-full object-cover" />
              </div>
            </motion.div>
          )}

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
              <div className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: project.results || '' }} />
            </div>
          </motion.div>

          {/* Gallery */}
          {Array.isArray(project.gallery) && project.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                Galeri
              </h3>
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {project.gallery.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    className="mb-4 overflow-hidden rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setModalImage(img)}
                  >
                    <img src={getImageUrl(img)} alt={`${project.title} ${i + 1}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Image Modal */}
        <Dialog open={modalImage !== null} onOpenChange={(open) => !open && setModalImage(null)}>
          <DialogContent className="max-w-7xl w-full p-0 overflow-hidden">
            {modalImage && (
              <img 
                src={getImageUrl(modalImage)} 
                alt="Gallery preview" 
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default AcademyDetail;
