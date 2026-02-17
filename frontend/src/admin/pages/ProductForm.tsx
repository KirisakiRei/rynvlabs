import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import SlugInput from '../components/SlugInput';
import ImageUpload from '../components/ImageUpload';
import TipTapEditor from '../components/TipTapEditor';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  features: Feature[];
  specs: string;
  stats: { label: string; value: string }[];
  background: string;
  solution: string;
  isPublished: boolean;
}

const emptyForm: ProductFormData = {
  title: '',
  slug: '',
  description: '',
  category: '',
  image: '',
  features: [],
  specs: '',
  stats: [],
  background: '',
  solution: '',
  isPublished: false,
};

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

  useEffect(() => {
    adminApi
      .get('/admin/categories')
      .then((res) => {
        const all = res.data.data ?? res.data;
        setCategories(all.filter((c: any) => c.type === 'PRODUCT'));
      })
      .catch((err) => { toast.error('Gagal memuat kategori', { description: getErrorMessage(err) }); });

    if (isEdit) {
      setLoading(true);
      adminApi
        .get(`/admin/products/${id}`)
        .then((res) => {
          const d = res.data.data ?? res.data;
          setForm({
            title: d.title || '',
            slug: d.slug || '',
            description: d.description || '',
            category: d.category || '',
            image: d.image || '',
            features: Array.isArray(d.features) ? d.features : [],
            specs: d.specs || '',
            stats: Array.isArray(d.stats) ? d.stats : [],
            background: d.background || '',
            solution: d.solution || '',
            isPublished: d.isPublished ?? false,
          });
        })
        .catch(() => navigate('/admin/products'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.put(`/admin/products/${id}`, form);
      } else {
        await adminApi.post('/admin/products', form);
      }
      toast.success(isEdit ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan');
      navigate('/admin/products');
    } catch (err: any) {
      toast.error('Gagal menyimpan produk', { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Feature helpers
  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, { icon: '', title: '', desc: '' }],
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, field: keyof Feature, val: string) => {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: val };
      return { ...prev, features };
    });
  };

  // Stat helpers
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
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          {isEdit ? 'Edit Produk' : 'Tambah Produk'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Slug, Category, Status — 2-column grid */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nama Produk</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <SlugInput value={form.slug} onChange={(v) => updateField('slug', v)} sourceValue={form.title} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">Tanpa Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
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
            <label className="block text-sm font-medium text-foreground mb-1.5">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        {/* Image */}
        <div className="bg-card border border-border rounded-xl p-5">
          <ImageUpload value={form.image} onChange={(v) => updateField('image', v)} label="Cover Image" />
        </div>

        {/* Features & Stats — side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-3">Fitur</label>
            <div className="space-y-3">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 bg-background border border-border rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={f.icon}
                      onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                      placeholder="Icon (e.g. Cpu, Wifi, Shield)"
                      className="w-full px-3 py-1.5 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                    <input
                      type="text"
                      value={f.title}
                      onChange={(e) => updateFeature(i, 'title', e.target.value)}
                      placeholder="Judul fitur"
                      className="w-full px-3 py-1.5 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                    <input
                      type="text"
                      value={f.desc}
                      onChange={(e) => updateFeature(i, 'desc', e.target.value)}
                      placeholder="Deskripsi fitur"
                      className="w-full px-3 py-1.5 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Fitur
            </button>
          </div>

          {/* Stats */}
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
                  <button type="button" onClick={() => removeStat(i)} className="p-2 text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addStat} className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary/80">
              <Plus className="w-4 h-4" />
              Tambah Stat
            </button>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-medium text-foreground mb-2">Spesifikasi</label>
          <TipTapEditor content={form.specs} onChange={(v) => updateField('specs', v)} />
        </div>

        {/* Background & Solution — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Background</label>
            <TipTapEditor content={form.background} onChange={(v) => updateField('background', v)} />
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Solution</label>
            <TipTapEditor content={form.solution} onChange={(v) => updateField('solution', v)} />
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
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
