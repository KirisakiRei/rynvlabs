import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import adminApi, { getErrorMessage } from '../lib/adminApi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SiteSetting {
  id: number;
  key: string;
  value: any;
}

interface LinkItem {
  label: string;
  href: string;
}

// Group definitions
const settingGroups: {
  title: string;
  description: string;
  keys: string[];
}[] = [
  {
    title: 'Informasi Brand',
    description: 'Nama dan identitas website',
    keys: ['brand_name'],
  },
  {
    title: 'SEO & Meta',
    description: 'Pengaturan meta tag untuk mesin pencari',
    keys: ['meta_title', 'meta_description'],
  },
  {
    title: 'Kontak',
    description: 'Informasi kontak bisnis',
    keys: ['wa_number'],
  },
  {
    title: 'Navigasi',
    description: 'Link yang tampil di navbar website',
    keys: ['nav_links'],
  },
  {
    title: 'Footer',
    description: 'Pengaturan bagian bawah website',
    keys: ['footer_text', 'footer_links'],
  },
];

const settingLabels: Record<string, string> = {
  brand_name: 'Nama Brand',
  wa_number: 'Nomor WhatsApp',
  footer_text: 'Teks Footer',
  meta_title: 'Meta Title',
  meta_description: 'Meta Description',
  nav_links: 'Link Navigasi',
  footer_links: 'Link Footer',
};

const settingHelps: Record<string, string> = {
  brand_name: 'Nama yang tampil di navbar dan footer',
  wa_number: 'Format internasional tanpa + (contoh: 6281234567890)',
  footer_text: 'Gunakan {year} untuk tahun otomatis',
  meta_title: 'Judul yang muncul di tab browser dan hasil pencarian',
  meta_description: 'Deskripsi singkat untuk hasil pencarian Google',
  nav_links: 'Link yang tampil di navigasi atas',
  footer_links: 'Link yang tampil di bagian footer',
};

function isLinkArray(value: any): value is LinkItem[] {
  return Array.isArray(value) && value.every(
    (item: any) => typeof item === 'object' && 'label' in item && 'href' in item
  );
}

// ---- Link Array Editor Component (with drag & drop) ----
function LinkArrayEditor({
  links,
  onChange,
}: {
  links: LinkItem[];
  onChange: (links: LinkItem[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLink = () => onChange([...links, { label: '', href: '' }]);

  const removeLink = (index: number) =>
    onChange(links.filter((_, i) => i !== index));

  const updateLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((_, idx) => `link-${idx}` === active.id);
    const newIndex = links.findIndex((_, idx) => `link-${idx}` === over.id);
    onChange(arrayMove(links, oldIndex, newIndex));
  };

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((_, idx) => `link-${idx}`)} strategy={verticalListSortingStrategy}>
          {links.map((link, i) => (
            <SortableLinkItem
              key={`link-${i}`}
              id={`link-${i}`}
              link={link}
              onUpdate={(field, value) => updateLink(i, field, value)}
              onRemove={() => removeLink(i)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={addLink}
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-1"
      >
        <Plus className="w-4 h-4" />
        Tambah Link
      </button>
    </div>
  );
}

// Sortable link item component
function SortableLinkItem({
  id,
  link,
  onUpdate,
  onRemove,
}: {
  id: string;
  link: LinkItem;
  onUpdate: (field: 'label' | 'href', value: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing hover:bg-muted/50 rounded transition-colors shrink-0"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <input
        type="text"
        value={link.label}
        onChange={(e) => onUpdate('label', e.target.value)}
        placeholder="Label (contoh: Beranda)"
        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      />
      <input
        type="text"
        value={link.href}
        onChange={(e) => onUpdate('href', e.target.value)}
        placeholder="URL (contoh: / atau #contact)"
        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      />
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/site-settings');
      setSettings(res.data.data ?? res.data);
    } catch (err) {
      toast.error('Gagal memuat settings', { description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (id: number, newValue: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: newValue } : s))
    );
  };

  const saveSetting = async (setting: SiteSetting) => {
    setSavingId(setting.id);
    try {
      await adminApi.put(`/admin/site-settings/${setting.key}`, { value: setting.value });
      toast.success(`${settingLabels[setting.key] || setting.key} berhasil disimpan`);
    } catch (err) {
      toast.error('Gagal menyimpan', { description: getErrorMessage(err) });
    } finally {
      setSavingId(null);
    }
  };

  const getSettingByKey = (key: string) => settings.find((s) => s.key === key);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  // Collect keys that are managed in groups
  const groupedKeys = new Set(settingGroups.flatMap((g) => g.keys));
  const ungroupedSettings = settings.filter((s) => !groupedKeys.has(s.key));

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Pengaturan umum website</p>
      </div>

      <div className="space-y-6">
        {settingGroups.map((group) => {
          const groupSettings = group.keys
            .map((key) => getSettingByKey(key))
            .filter(Boolean) as SiteSetting[];
          if (groupSettings.length === 0) return null;

          return (
            <div key={group.title} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>
              </div>

              <div className="p-5 space-y-5">
                {groupSettings.map((setting) => {
                  const isLinks = isLinkArray(setting.value);

                  return (
                    <div key={setting.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-foreground">
                            {settingLabels[setting.key] || setting.key}
                          </label>
                          {settingHelps[setting.key] && (
                            <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                              {settingHelps[setting.key]}
                            </p>
                          )}

                          {isLinks ? (
                            <LinkArrayEditor
                              links={setting.value as LinkItem[]}
                              onChange={(links) => updateSetting(setting.id, links)}
                            />
                          ) : setting.key === 'meta_description' ? (
                            <textarea
                              value={String(setting.value ?? '')}
                              onChange={(e) => updateSetting(setting.id, e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={String(setting.value ?? '')}
                              onChange={(e) => updateSetting(setting.id, e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => saveSetting(setting)}
                          disabled={savingId === setting.id}
                          className="mt-5 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                          title="Simpan"
                        >
                          {savingId === setting.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Ungrouped settings (fallback) */}
        {ungroupedSettings.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">Lainnya</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Pengaturan tambahan</p>
            </div>
            <div className="p-5 space-y-5">
              {ungroupedSettings.map((setting) => {
                const isObj = typeof setting.value === 'object' && setting.value !== null;
                const displayValue = isObj
                  ? JSON.stringify(setting.value, null, 2)
                  : String(setting.value ?? '');

                return (
                  <div key={setting.id} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {setting.key}
                      </label>
                      {isObj ? (
                        <textarea
                          value={displayValue}
                          onChange={(e) => {
                            try {
                              updateSetting(setting.id, JSON.parse(e.target.value));
                            } catch {
                              // ignore invalid JSON while typing
                            }
                          }}
                          rows={4}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-y"
                        />
                      ) : (
                        <input
                          type="text"
                          value={displayValue}
                          onChange={(e) => updateSetting(setting.id, e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => saveSetting(setting)}
                      disabled={savingId === setting.id}
                      className="mt-5 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                      title="Simpan"
                    >
                      {savingId === setting.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
