import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

interface Product {
  id: number;
  title: string;
  slug: string;
  isPublished: boolean;
  sortOrder: number;
}

export default function ProductList() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/products');
      setItems(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat data produk', { description: getErrorMessage(err) });
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
      await adminApi.delete(`/admin/products/${deleteId}`);
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Produk berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus', { description: getErrorMessage(err) });
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublish = async (item: Product) => {
    try {
      await adminApi.put(`/admin/products/${item.id}`, {
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
      header: 'Nama Produk',
      render: (item: Product) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground">{item.slug}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Product) => (
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
      render: (item: Product) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/products/${item.id}/edit`}
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
          <h1 className="text-2xl font-heading font-bold text-foreground">Produk</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola produk</p>
        </div>
        <Link
          to="/admin/products/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="Belum ada produk" />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Produk"
        description="Produk yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
