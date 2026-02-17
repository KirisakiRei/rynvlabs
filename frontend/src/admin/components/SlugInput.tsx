import { useEffect, useState } from 'react';

interface SlugInputProps {
  value: string;
  onChange: (slug: string) => void;
  sourceValue: string;
  label?: string;
  disabled?: boolean;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function SlugInput({
  value,
  onChange,
  sourceValue,
  label = 'Slug',
  disabled = false,
}: SlugInputProps) {
  const [autoGenerate, setAutoGenerate] = useState(!value);

  useEffect(() => {
    if (autoGenerate && sourceValue) {
      onChange(generateSlug(sourceValue));
    }
  }, [sourceValue, autoGenerate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
            className="rounded border-border"
          />
          Auto-generate
        </label>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setAutoGenerate(false);
          onChange(generateSlug(e.target.value));
        }}
        disabled={disabled || autoGenerate}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
        placeholder="auto-generated-slug"
      />
    </div>
  );
}
