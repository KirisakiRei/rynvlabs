import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage, getImageUrl } from '../lib/adminApi';
import SlugInput from '../components/SlugInput';
import ImageUpload from '../components/ImageUpload';
import TipTapEditor from '../components/TipTapEditor';
import MediaPicker from '../components/MediaPicker';

interface AcademyForm {
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  abstract: string;
  methodology: string;
  results: string;
  image: string;
  wiringDiagram: string;
  gallery: string[];
  year: number;
  isPublished: boolean;
}

const currentYear = new Date().getFullYear();

const emptyForm: AcademyForm = {
  title: '',
  slug: '',
  description: '',
  techStack: [],
  abstract: '',
  methodology: '',
  results: '',
  image: '',
  wiringDiagram: '',
  gallery: [],
  year: currentYear,
  isPublished: false,
};

export default function AcademyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<AcademyForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techStacks, setTechStacks] = useState<{ id: number; name: string }[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    adminApi
      .get('/admin/tech-stacks')
      .then((res) => setTechStacks(res.data.data ?? res.data))
      .catch((err) => { toast.error('Gagal memuat tech stacks', { description: getErrorMessage(err) }); });

    if (isEdit) {
      setLoading(true);
      adminApi
        .get(`/admin/academy/${id}`)
        .then((res) => {
          const d = res.data.data ?? res.data;
          setForm({
            title: d.title || '',
            slug: d.slug || '',
            description: d.description || '',
            techStack: Array.isArray(d.techStack) ? d.techStack : [],
            abstract: d.abstract || '',
            methodology: d.methodology || '',
            results: d.results || '',
            image: d.image || '',
            wiringDiagram: d.wiringDiagram || '',
            gallery: Array.isArray(d.gallery) ? d.gallery : [],
            year: d.year || currentYear,
            isPublished: d.isPublished ?? false,
          });
        })
        .catch(() => navigate('/admin/academy'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.put(`/admin/academy/${id}`, form);
      } else {
        await adminApi.post('/admin/academy', form);
      }
      toast.success(isEdit ? 'Tugas akhir berhasil diperbarui' : 'Tugas akhir berhasil ditambahkan');
      navigate('/admin/academy');
    } catch (err: any) {
      toast.error('Gagal menyimpan tugas akhir', { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof AcademyForm>(key: K, value: AcademyForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTechStack = (name: string) => {
    setForm((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(name)
        ? prev.techStack.filter((t) => t !== name)
        : [...prev.techStack, name],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/academy')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          {isEdit ? 'Edit Tugas Akhir' : 'Tambah Tugas Akhir'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Slug, Year, Status — 2-column */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Judul</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Judul tugas akhir..."
              />
            </div>
            <SlugInput value={form.slug} onChange={(v) => updateField('slug', v)} sourceValue={form.title} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tahun</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField('year', parseInt(e.target.value) || currentYear)}
                min={2000}
                max={2100}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <div className="flex items-center gap-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => updateField('isPublished', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Published</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Deskripsi Singkat</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        {/* Images & Tech Stack — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <ImageUpload value={form.image} onChange={(v) => updateField('image', v)} label="Cover Image" />
            <ImageUpload
              value={form.wiringDiagram}
              onChange={(v) => updateField('wiringDiagram', v)}
              label="Wiring Diagram"
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-3">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((ts) => (
                <button
                  key={ts.id}
                  type="button"
                  onClick={() => toggleTechStack(ts.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    form.techStack.includes(ts.name)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {ts.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-medium text-foreground mb-3">Gallery</label>
          
          {/* Gallery Preview Grid */}
          {form.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {form.gallery.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                  <img
                    src={getImageUrl(url)}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newGallery = form.gallery.filter((_, i) => i !== idx);
                      updateField('gallery', newGallery);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500/90 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border hover:border-primary rounded-lg text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Upload className="w-4 h-4" />
            {form.gallery.length > 0 ? 'Tambah / Ubah Gambar' : 'Pilih Gambar'}
          </button>
        </div>

        {/* Abstract */}
        <div className="bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-medium text-foreground mb-2">Abstrak</label>
          <TipTapEditor content={form.abstract} onChange={(v) => updateField('abstract', v)} />
        </div>

        {/* Methodology & Results — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Metodologi</label>
            <TipTapEditor content={form.methodology} onChange={(v) => updateField('methodology', v)} />
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Hasil</label>
            <TipTapEditor content={form.results} onChange={(v) => updateField('results', v)} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/academy')}
            className="px-6 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            Batal
          </button>
        </div>
      </form>

      {/* MediaPicker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(urls) => updateField('gallery', urls)}
        multiple={true}
        currentValues={form.gallery}
      />
    </div>
  );
}
