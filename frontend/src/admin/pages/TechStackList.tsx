import { useEffect, useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

interface TechStack {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
}

export default function TechStackList() {
  const [items, setItems] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<TechStack | null>(null);
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formColor, setFormColor] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/tech-stacks');
      setItems(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat tech stack', { description: getErrorMessage(err) });
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
    setFormIcon('');
    setFormColor('');
    setShowForm(true);
  };

  const openEdit = (item: TechStack) => {
    setEditItem(item);
    setFormName(item.name);
    setFormIcon(item.icon || '');
    setFormColor(item.color || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: formName, icon: formIcon || undefined, color: formColor || undefined };
      if (editItem) {
        await adminApi.put(`/admin/tech-stacks/${editItem.id}`, payload);
      } else {
        await adminApi.post('/admin/tech-stacks', payload);
      }
      setShowForm(false);
      fetchItems();
      toast.success(editItem ? 'Tech stack berhasil diperbarui' : 'Tech stack berhasil ditambah');
    } catch (err: any) {
      toast.error('Gagal menyimpan', { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.delete(`/admin/tech-stacks/${deleteId}`);
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Tech stack berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus', { description: getErrorMessage(err) });
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nama',
      render: (item: TechStack) => (
        <div className="flex items-center gap-2">
          {item.color && (
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
          )}
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (item: TechStack) => (
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
          <h1 className="text-2xl font-heading font-bold text-foreground">Tech Stack</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola master data tech stack</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Tech Stack
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="Belum ada tech stack" />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">
                {editItem ? 'Edit Tech Stack' : 'Tambah Tech Stack'}
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
                  placeholder="e.g. React, Node.js..."
                />
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
                    placeholder="#61DAFB"
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
        title="Hapus Tech Stack"
        description="Yakin ingin menghapus tech stack ini?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
