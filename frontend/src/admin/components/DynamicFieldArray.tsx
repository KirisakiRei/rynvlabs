import { Plus, X } from 'lucide-react';

interface DynamicFieldArrayProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  addLabel?: string;
}

export default function DynamicFieldArray({
  values,
  onChange,
  label,
  placeholder = 'Enter value...',
  addLabel = 'Tambah',
}: DynamicFieldArrayProps) {
  const addField = () => {
    onChange([...values, '']);
  };

  const removeField = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateField = (index: number, newValue: string) => {
    const updated = [...values];
    updated[index] = newValue;
    onChange(updated);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}

      <div className="space-y-2">
        {values.map((val, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={val}
              onChange={(e) => updateField(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => removeField(index)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addField}
        className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  );
}
