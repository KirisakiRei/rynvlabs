import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

interface AcademyProject {
  id: number;
  title: string;
  slug: string;
  year: number;
  isPublished: boolean;
  sortOrder: number;
}

export default function AcademyList() {
  const [items, setItems] = useState<AcademyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/academy');
      setItems(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat data academy', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.delete(`/admin/academy/${deleteId}`);
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Proyek academy berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus', { description: getErrorMessage(err) });
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublish = async (item: AcademyProject) => {
    try {
      await adminApi.put(`/admin/academy/${item.id}`, {
        ...item,
        isPublished: !item.isPublished,
      });
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isPublished: !p.isPublished } : p))
      );
    } catch (err) {
      toast.error('Gagal mengubah status', { description: getErrorMessage(err) });
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Judul',
      render: (item: AcademyProject) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground">{item.slug}</div>
        </div>
      ),
    },
    {
      key: 'year',
      header: 'Tahun',
      render: (item: AcademyProject) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          {item.year}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: AcademyProject) => (
        <button
          onClick={() => togglePublish(item)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
            item.isPublished
              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {item.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {item.isPublished ? 'Published' : 'Draft'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (item: AcademyProject) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/academy/${item.id}/edit`}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
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
          <h1 className="text-2xl font-heading font-bold text-foreground">Tugas Akhir</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola proyek tugas akhir / akademik</p>
        </div>
        <Link
          to="/admin/academy/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Tugas Akhir
        </Link>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="Belum ada tugas akhir" />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Tugas Akhir"
        description="Data yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
