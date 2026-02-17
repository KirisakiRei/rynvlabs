import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage, getImageUrl } from '../lib/adminApi';
import SlugInput from '../components/SlugInput';
import ImageUpload from '../components/ImageUpload';
import TipTapEditor from '../components/TipTapEditor';
import DynamicFieldArray from '../components/DynamicFieldArray';
import MediaPicker from '../components/MediaPicker';

interface ProjectForm {
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  techStack: string[];
  challenge: string;
  solution: string;
  deepDive: string;
  gallery: string[];
  stats: { label: string; value: string }[];
  isPublished: boolean;
}

const emptyForm: ProjectForm = {
  title: '',
  slug: '',
  description: '',
  category: '',
  image: '',
  techStack: [],
  challenge: '',
  solution: '',
  deepDive: '',
  gallery: [],
  stats: [],
  isPublished: false,
};

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techStacks, setTechStacks] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    adminApi
      .get('/admin/tech-stacks')
      .then((res) => setTechStacks(res.data.data ?? res.data))
      .catch((err) => { toast.error('Gagal memuat tech stacks', { description: getErrorMessage(err) }); });

    adminApi
      .get('/admin/categories')
      .then((res) => {
        const all = res.data.data ?? res.data;
        setCategories(all.filter((c: any) => c.type === 'PROJECT'));
      })
      .catch((err) => { toast.error('Gagal memuat kategori', { description: getErrorMessage(err) }); });

    if (isEdit) {
      setLoading(true);
      adminApi
        .get(`/admin/projects/${id}`)
        .then((res) => {
          const d = res.data.data ?? res.data;
          setForm({
            title: d.title || '',
            slug: d.slug || '',
            description: d.description || '',
            category: d.category || '',
            image: d.image || '',
            techStack: Array.isArray(d.techStack) ? d.techStack : [],
            challenge: d.challenge || '',
            solution: d.solution || '',
            deepDive: d.deepDive || '',
            gallery: Array.isArray(d.gallery) ? d.gallery : [],
            stats: Array.isArray(d.stats) ? d.stats : [],
            isPublished: d.isPublished ?? false,
          });
        })
        .catch(() => navigate('/admin/projects'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.put(`/admin/projects/${id}`, form);
      } else {
        await adminApi.post('/admin/projects', form);
      }
      toast.success(isEdit ? 'Proyek berhasil diperbarui' : 'Proyek berhasil ditambahkan');
      navigate('/admin/projects');
    } catch (err: any) {
      toast.error('Gagal menyimpan proyek', { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) => {
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

  const addStat = () => {
    setForm((prev) => ({ ...prev, stats: [...prev.stats, { label: '', value: '' }] }));
  };

  const removeStat = (index: number) => {
    setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    setForm((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: val };
      return { ...prev, stats };
    });
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
          onClick={() => navigate('/admin/projects')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {isEdit ? 'Edit Proyek' : 'Tambah Proyek'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Slug, Category, Status — 2-column */}
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
                placeholder="Nama proyek..."
              />
            </div>
            <SlugInput value={form.slug} onChange={(v) => updateField('slug', v)} sourceValue={form.title} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <div className="flex items-center gap-3 mt-2">
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
              placeholder="Deskripsi singkat proyek..."
            />
          </div>
        </div>

        {/* Image & Tech Stack — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <ImageUpload
              value={form.image}
              onChange={(v) => updateField('image', v)}
              label="Cover Image"
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

        {/* Challenge & Solution — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Challenge</label>
            <TipTapEditor
              content={form.challenge}
              onChange={(v) => updateField('challenge', v)}
              placeholder="Tantangan proyek..."
            />
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Solution</label>
            <TipTapEditor
              content={form.solution}
              onChange={(v) => updateField('solution', v)}
              placeholder="Solusi proyek..."
            />
          </div>
        </div>

        {/* Deep Dive */}
        <div className="bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-medium text-foreground mb-2">Deep Dive</label>
          <TipTapEditor
            content={form.deepDive}
            onChange={(v) => updateField('deepDive', v)}
            placeholder="Penjelasan mendalam..."
          />
        </div>

        {/* Gallery & Stats — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-3">Gallery</label>
            
            {/* Gallery Preview Grid */}
            {form.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
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
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-3">Statistik</label>
            <div className="space-y-2">
              {form.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStat}
              className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Tambah Stat
            </button>
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
            onClick={() => navigate('/admin/projects')}
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
