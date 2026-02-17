import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/projects');
      setProjects(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat data proyek', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.delete(`/admin/projects/${deleteId}`);
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Proyek berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus proyek', { description: getErrorMessage(err) });
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      await adminApi.put(`/admin/projects/${project.id}`, {
        ...project,
        isPublished: !project.isPublished,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isPublished: !p.isPublished } : p))
      );
    } catch (err) {
      toast.error('Gagal mengubah status', { description: getErrorMessage(err) });
    }
  };

  const categoryBadge = (cat: string) => {
    const colors: Record<string, string> = {
      SOFTWARE: 'bg-blue-500/10 text-blue-400',
      IOT: 'bg-green-500/10 text-green-400',
      AUTOMATION: 'bg-purple-500/10 text-purple-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[cat] || 'bg-muted text-muted-foreground'}`}>
        {cat}
      </span>
    );
  };

  const columns = [
    {
      key: 'title',
      header: 'Judul',
      render: (p: Project) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-muted-foreground">{p.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (p: Project) => categoryBadge(p.category),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Project) => (
        <button
          onClick={() => togglePublish(p)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
            p.isPublished
              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {p.isPublished ? 'Published' : 'Draft'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (p: Project) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/projects/${p.id}/edit`}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteId(p.id)}
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
          <h1 className="text-2xl font-heading font-bold text-foreground">Proyek</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola proyek portfolio</p>
        </div>
        <Link
          to="/admin/projects/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Proyek
        </Link>
      </div>

      <DataTable columns={columns} data={projects} loading={loading} emptyMessage="Belum ada proyek" />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Proyek"
        description="Proyek yang dihapus tidak dapat dikembalikan. Yakin ingin menghapus?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
