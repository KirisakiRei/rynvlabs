import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import DynamicIcon, { iconMap } from '@/components/DynamicIcon';

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  currentValue?: string;
}

export default function IconPicker({
  isOpen,
  onClose,
  onSelect,
  currentValue = '',
}: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(currentValue);

  // Get all icon names from iconMap
  const allIcons = useMemo(() => Object.keys(iconMap), []);

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return allIcons;
    const query = searchQuery.toLowerCase();
    return allIcons.filter((name) => name.toLowerCase().includes(query));
  }, [searchQuery, allIcons]);

  const handleSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = () => {
    onSelect(selectedIcon);
    onClose();
  };

  const handleClear = () => {
    setSelectedIcon('');
    onSelect('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Pilih Icon
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari icon... (code, rocket, mail, etc.)"
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {filteredIcons.length} icon {searchQuery && `ditemukan untuk "${searchQuery}"`}
          </p>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Tidak ada icon yang cocok dengan "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {filteredIcons.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleSelect(iconName)}
                  className={`group relative aspect-square flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:border-primary/50 hover:bg-primary/5 ${
                    selectedIcon === iconName
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-transparent bg-muted/30'
                  }`}
                  title={iconName}
                >
                  <DynamicIcon name={iconName} size={20} className="text-foreground" />
                  <span className="absolute bottom-0 left-0 right-0 bg-background/95 text-[9px] text-muted-foreground px-1 py-0.5 text-center truncate opacity-0 group-hover:opacity-100 transition-opacity rounded-b">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Preview & Actions */}
        <div className="border-t border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedIcon ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                  <DynamicIcon name={selectedIcon} size={20} className="text-foreground" />
                  <span className="text-sm font-medium text-foreground">{selectedIcon}</span>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hapus
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Pilih salah satu icon</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedIcon}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pilih Icon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
