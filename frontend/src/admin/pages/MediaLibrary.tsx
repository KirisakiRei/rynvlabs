import { useEffect, useState, useCallback } from 'react';
import { Upload, Trash2, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import ConfirmDialog from '../components/ConfirmDialog';

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/media');
      setItems(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat media', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        await adminApi.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchItems();
      toast.success('Upload berhasil');
    } catch (err) {
      toast.error('Gagal upload file', { description: getErrorMessage(err) });
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.delete(`/admin/media/${deleteId}`);
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('Media berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus media', { description: getErrorMessage(err) });
    } finally {
      setDeleteId(null);
    }
  };

  const copyPath = (item: MediaItem) => {
    const url = `${API_BASE}${item.path.startsWith('/') ? '' : '/'}${item.path}`;
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getImageSrc = (path: string) => {
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola file media website</p>
        </div>
        <label className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada media. Upload file pertama Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {isImage(item.mimeType) ? (
                  <img
                    src={getImageSrc(item.path)}
                    alt={item.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="text-center p-2">
                    <div className="text-2xl text-muted-foreground mb-1">📄</div>
                    <span className="text-xs text-muted-foreground uppercase">
                      {item.mimeType.split('/')[1]}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs text-foreground truncate font-medium" title={item.originalName}>
                  {item.originalName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatSize(item.size)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => copyPath(item)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Media"
        description="File yang dihapus tidak dapat dikembalikan. Yakin?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
      />
    </div>
  );
}
