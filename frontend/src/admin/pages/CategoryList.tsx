import { useEffect, useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'PROJECT' | 'ACADEMY' | 'PRODUCT';
  color: string | null;
  sortOrder: number;
}

const typeLabels: Record<string, string> = {
  PROJECT: 'Proyek',
  ACADEMY: 'Tugas Akhir',
  PRODUCT: 'Produk',
};

export default function CategoryList() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'PROJECT' | 'ACADEMY' | 'PRODUCT'>('PROJECT');
  const [formColor, setFormColor] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/categories');
      setItems(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat kategori', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setFormName('');
    setFormType('PROJECT');
    setFormColor('');
    setShowForm(true);
  };

  const openEdit = (item: Category) => {
    setEditItem(item);
    setFormName(item.name);
    setFormType(item.type);
    setFormColor(item.color || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: formName, type: formType, color: formColor || undefined };
      if (editItem) {
        await adminApi.put(`/admin/categories/${editItem.id}`, payload);
      } else {
        await adminApi.post('/admin/categories', payload);
      }
      setShowForm(false);
      fetchItems();
      toast.success(editItem ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambah');
    } catch (err: any) {
      toast.error('Gagal menyimpan', { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.delete(`/admin/categories/${deleteId}`);
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Kategori berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus kategori', { description: getErrorMessage(err) });
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nama',
      render: (item: Category) => (
        <div className="flex items-center gap-2">
          {item.color && (
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
          )}
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipe',
      render: (item: Category) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          {typeLabels[item.type] || item.type}
        </span>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (item: Category) => <span className="text-muted-foreground text-xs">{item.slug}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (item: Category) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => openEdit(item)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Kategori</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola kategori konten</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="Belum ada kategori" />

      {/* Inline Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">
                {editItem ? 'Edit Kategori' : 'Tambah Kategori'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nama</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tipe</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                >
                  <option value="PROJECT">Proyek</option>
                  <option value="ACADEMY">Tugas Akhir</option>
                  <option value="PRODUCT">Produk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Warna (opsional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formColor || '#888888'}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="#888888"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Kategori"
        description="Yakin ingin menghapus kategori ini?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
