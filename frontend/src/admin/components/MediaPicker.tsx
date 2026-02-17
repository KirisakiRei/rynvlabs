import { useState, useEffect, useCallback } from 'react';
import { X, Upload, Loader2, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage, getImageUrl } from '../lib/adminApi';

interface Media {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  currentValues?: string[];
}

export default function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  multiple = true,
  currentValues = [],
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Initialize selected items from current values
  useEffect(() => {
    if (isOpen) {
      setSelectedItems(currentValues);
      fetchMedia();
    }
  }, [isOpen, currentValues]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/media', {
        params: { type: 'image', limit: 100 },
      });
      const data = res.data.data ?? res.data;
      setMediaList(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      toast.error('Gagal memuat media', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Filter only images
    const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Hanya file gambar yang diperbolehkan');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await adminApi.post('/admin/media/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = Array.isArray(res.data) ? res.data : [res.data];
      const newPaths = uploaded.map((m: Media) => m.path);

      toast.success(`${uploaded.length} gambar berhasil diupload`);

      // Auto-select uploaded images
      if (multiple) {
        setSelectedItems([...selectedItems, ...newPaths]);
      } else {
        setSelectedItems(newPaths);
      }

      // Refresh library
      fetchMedia();
      setActiveTab('library');
    } catch (err) {
      toast.error('Gagal mengupload gambar', { description: getErrorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const toggleSelect = (path: string) => {
    if (multiple) {
      setSelectedItems((prev) =>
        prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
      );
    } else {
      setSelectedItems([path]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedItems);
    onClose();
  };

  const handleDeleteMedia = async (media: Media) => {
    if (!confirm(`Hapus "${media.originalName}"?`)) return;

    try {
      await adminApi.delete(`/admin/media/${media.id}`);
      toast.success('Media berhasil dihapus');
      setMediaList((prev) => prev.filter((m) => m.id !== media.id));
      setSelectedItems((prev) => prev.filter((p) => p !== media.path));
    } catch (err) {
      toast.error('Gagal menghapus media', { description: getErrorMessage(err) });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-5xl shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Pilih Gambar
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'library'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Media Library
            </span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Baru
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Mengupload gambar...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-foreground font-medium mb-1">
                    Drag & drop gambar di sini
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    atau klik tombol di bawah untuk memilih file
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Pilih File
                  </label>
                  <p className="text-xs text-muted-foreground mt-4">
                    Maksimal 20 file, hanya gambar (JPG, PNG, WebP, GIF)
                  </p>
                </>
              )}
            </div>
          )}

          {activeTab === 'library' && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Belum ada gambar</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    Upload gambar pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaList.map((media) => {
                    const isSelected = selectedItems.includes(media.path);
                    return (
                      <div
                        key={media.id}
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => toggleSelect(media.path)}
                      >
                        <img
                          src={getImageUrl(media.path)}
                          alt={media.originalName}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(media);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white truncate">{media.originalName}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedItems.length > 0 ? (
              <span>
                {selectedItems.length} gambar dipilih
              </span>
            ) : (
              <span>Pilih {multiple ? 'satu atau lebih' : 'satu'} gambar</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pilih {selectedItems.length > 0 && `(${selectedItems.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
