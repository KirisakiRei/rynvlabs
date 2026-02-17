import { useEffect, useState } from 'react';
import { Save, Loader2, Eye, EyeOff, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import DragDropList from '../components/DragDropList';
import TipTapEditor from '../components/TipTapEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import IconPicker from '../components/IconPicker';
import DynamicIcon from '@/components/DynamicIcon';

interface LandingSection {
  id: number;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  content: any;
  isVisible: boolean;
  sortOrder: number;
}

// Helper component for array inputs
interface ArrayItem {
  [key: string]: any;
}

interface ArrayEditorProps {
  items: ArrayItem[];
  onChange: (items: ArrayItem[]) => void;
  fields: { key: string; label: string; type?: 'text' | 'textarea' }[];
}

function ArrayEditor({ items, onChange, fields }: ArrayEditorProps) {
  const addItem = () => {
    const newItem: ArrayItem = {};
    fields.forEach((f) => (newItem[f.key] = ''));
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="border border-border rounded-lg p-3 bg-muted/30">
          <div className="flex items-start gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-2 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.key] || ''}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[field.key] || ''}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0 mt-1"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors border border-dashed border-primary/50"
      >
        <Plus className="w-4 h-4" />
        Tambah Item
      </button>
    </div>
  );
}

// Simple string array editor
function SimpleArrayEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const addItem = () => onChange([...items, '']);
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(idx, e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="button"
            onClick={() => removeItem(idx)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors border border-dashed border-primary/50 w-full"
      >
        <Plus className="w-4 h-4" />
        Tambah Item
      </button>
    </div>
  );
}

export default function LandingEditor() {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [editSection, setEditSection] = useState<LandingSection | null>(null);
  const [visibilityTarget, setVisibilityTarget] = useState<LandingSection | null>(null);

  // Render content editor based on section type
  const renderContentEditor = (section: LandingSection) => {
    const updateContent = (newContent: any) => {
      setEditSection({ ...section, content: newContent });
    };

    switch (section.sectionKey) {
      case 'hero':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                CTA Primary - Text
              </label>
              <input
                type="text"
                value={section.content?.ctaPrimary?.text || ''}
                onChange={(e) =>
                  updateContent({
                    ...section.content,
                    ctaPrimary: { ...section.content?.ctaPrimary, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                CTA Primary - Link
              </label>
              <input
                type="text"
                value={section.content?.ctaPrimary?.link || ''}
                onChange={(e) =>
                  updateContent({
                    ...section.content,
                    ctaPrimary: { ...section.content?.ctaPrimary, link: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                CTA Secondary - Text
              </label>
              <input
                type="text"
                value={section.content?.ctaSecondary?.text || ''}
                onChange={(e) =>
                  updateContent({
                    ...section.content,
                    ctaSecondary: { ...section.content?.ctaSecondary, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                CTA Secondary - Link
              </label>
              <input
                type="text"
                value={section.content?.ctaSecondary?.link || ''}
                onChange={(e) =>
                  updateContent({
                    ...section.content,
                    ctaSecondary: { ...section.content?.ctaSecondary, link: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        );

      case 'services':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Services Items</label>
            <div className="space-y-3">
              {(section.content?.items || []).map((item: any, idx: number) => (
                <div key={idx} className="border border-border rounded-lg p-3 bg-muted/30">
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Icon (Lucide name)
                        </label>
                        <input
                          type="text"
                          value={item.icon || ''}
                          onChange={(e) => {
                            const items = [...section.content.items];
                            items[idx] = { ...items[idx], icon: e.target.value };
                            updateContent({ items });
                          }}
                          className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => {
                            const items = [...section.content.items];
                            items[idx] = { ...items[idx], title: e.target.value };
                            updateContent({ items });
                          }}
                          className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Description
                        </label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => {
                            const items = [...section.content.items];
                            items[idx] = { ...items[idx], description: e.target.value };
                            updateContent({ items });
                          }}
                          rows={2}
                          className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(item.tags) ? item.tags.join(', ') : ''}
                          onChange={(e) => {
                            const items = [...section.content.items];
                            items[idx] = {
                              ...items[idx],
                              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                            };
                            updateContent({ items });
                          }}
                          placeholder="React, Laravel, Node.js"
                          className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const items = section.content.items.filter((_: any, i: number) => i !== idx);
                        updateContent({ items });
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0 mt-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const items = [...(section.content?.items || []), { icon: '', title: '', description: '', tags: [] }];
                  updateContent({ items });
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors border border-dashed border-primary/50"
              >
                <Plus className="w-4 h-4" />
                Tambah Item
              </button>
            </div>
          </div>
        );

      case 'product':
        return (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Featured Product Slug
            </label>
            <input
              type="text"
              value={section.content?.featuredProductSlug || ''}
              onChange={(e) => updateContent({ featuredProductSlug: e.target.value })}
              placeholder="smart-scales"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Masukkan slug produk yang ingin ditampilkan di section ini
            </p>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Max Items
              </label>
              <input
                type="number"
                value={section.content?.maxItems || 6}
                onChange={(e) =>
                  updateContent({ ...section.content, maxItems: parseInt(e.target.value) || 6 })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Default Filter
              </label>
              <input
                type="text"
                value={section.content?.defaultFilter || 'all'}
                onChange={(e) =>
                  updateContent({ ...section.content, defaultFilter: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        );

      case 'academy':
        return (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Max Items
            </label>
            <input
              type="number"
              value={section.content?.maxItems || 3}
              onChange={(e) =>
                updateContent({ maxItems: parseInt(e.target.value) || 3 })
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        );

      case 'process':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Process Steps</label>
            <ArrayEditor
              items={section.content?.steps || []}
              onChange={(steps) => updateContent({ steps })}
              fields={[
                { key: 'icon', label: 'Icon (Lucide name)', type: 'text' },
                { key: 'label', label: 'Label', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
              ]}
            />
          </div>
        );

      case 'tech-ticker':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tech Stack Items</label>
            <SimpleArrayEditor
              items={section.content?.items || []}
              onChange={(items) => updateContent({ items })}
            />
          </div>
        );

      case 'contact':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contact Categories</label>
            <ArrayEditor
              items={section.content?.categories || []}
              onChange={(categories) => updateContent({ categories })}
              fields={[
                { key: 'icon', label: 'Icon (Lucide name)', type: 'text' },
                { key: 'label', label: 'Label', type: 'text' },
                { key: 'waLabel', label: 'WhatsApp Label', type: 'text' },
              ]}
            />
          </div>
        );

      default:
        return (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Section type tidak dikenali. Edit sebagai JSON:
            </p>
            <textarea
              value={JSON.stringify(section.content, null, 2)}
              onChange={(e) => {
                try {
                  updateContent(JSON.parse(e.target.value));
                } catch {
                  // ignore parse errors while typing
                }
              }}
              rows={8}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-y"
            />
          </div>
        );
    }
  };

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/landing-sections');
      const data = res.data.data ?? res.data;
      setSections(data.sort((a: LandingSection, b: LandingSection) => a.sortOrder - b.sortOrder));
    } catch (err) {
      toast.error('Gagal memuat landing sections', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const toggleVisibility = async (section: LandingSection) => {
    try {
      await adminApi.patch(`/admin/landing-sections/${section.sectionKey}/visibility`, {
        isVisible: !section.isVisible,
      });
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, isVisible: !s.isVisible } : s))
      );
      toast.success(`Section "${section.title}" ${section.isVisible ? 'disembunyikan' : 'ditampilkan'}`);
    } catch (err) {
      toast.error('Gagal mengubah visibilitas', { description: getErrorMessage(err) });
    } finally {
      setVisibilityTarget(null);
    }
  };

  const handleReorder = async (newItems: LandingSection[]) => {
    setSections(newItems);
    setReordering(true);
    try {
      await adminApi.patch('/admin/landing-sections/reorder', {
        items: newItems.map((item, index) => ({ id: item.id, sortOrder: index })),
      });
    } catch (err) {
      toast.error('Gagal menyusun ulang', { description: getErrorMessage(err) });
      fetchSections();
    } finally {
      setReordering(false);
    }
  };

  const handleSaveSection = async () => {
    if (!editSection) return;
    setSaving(editSection.id);
    try {
      await adminApi.put(`/admin/landing-sections/${editSection.sectionKey}`, {
        title: editSection.title,
        subtitle: editSection.subtitle,
        content: editSection.content,
      });
      setSections((prev) =>
        prev.map((s) => (s.id === editSection.id ? editSection : s))
      );
      setEditSection(null);
      toast.success('Section berhasil disimpan');
    } catch (err) {
      toast.error('Gagal menyimpan section', { description: getErrorMessage(err) });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Landing Page</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Atur konten, urutan, dan visibilitas section landing page. Drag untuk mengubah urutan.
        </p>
      </div>

      <DragDropList
        items={sections}
        onReorder={handleReorder}
        renderItem={(section) => (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {section.sectionKey}
                  </span>
                  <h3 className="font-medium text-foreground">{section.title}</h3>
                </div>
                {section.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVisibilityTarget(section)}
                  className={`p-1.5 rounded transition-colors ${
                    section.isVisible
                      ? 'text-green-400 hover:bg-green-500/10'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                  title={section.isVisible ? 'Visible' : 'Hidden'}
                >
                  {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditSection({ ...section })}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Edit Konten
                </button>
              </div>
            </div>
          </div>
        )}
      />

      {reordering && (
        <p className="text-sm text-muted-foreground mt-2 animate-pulse">Menyimpan urutan...</p>
      )}

      {/* Edit Modal */}
      {editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
              Edit: {editSection.sectionKey}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  value={editSection.title}
                  onChange={(e) => setEditSection({ ...editSection, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={editSection.subtitle || ''}
                  onChange={(e) => setEditSection({ ...editSection, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Content
                </label>
                {renderContentEditor(editSection)}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSaveSection}
                disabled={saving === editSection.id}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving === editSection.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan
              </button>
              <button
                onClick={() => setEditSection(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Confirmation Dialog */}
      <ConfirmDialog
        open={visibilityTarget !== null}
        onOpenChange={(open) => !open && setVisibilityTarget(null)}
        title={visibilityTarget?.isVisible ? 'Sembunyikan Section' : 'Tampilkan Section'}
        description={
          visibilityTarget?.isVisible
            ? `Apakah Anda yakin ingin menyembunyikan section "${visibilityTarget?.title}"? Section ini tidak akan tampil di landing page.`
            : `Apakah Anda yakin ingin menampilkan section "${visibilityTarget?.title}"? Section ini akan tampil di landing page.`
        }
        confirmLabel={visibilityTarget?.isVisible ? 'Ya, Sembunyikan' : 'Ya, Tampilkan'}
        destructive={visibilityTarget?.isVisible ?? false}
        onConfirm={() => visibilityTarget && toggleVisibility(visibilityTarget)}
      />
    </div>
  );
}
