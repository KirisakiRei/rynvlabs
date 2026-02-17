import { useEffect, useState } from 'react';
import publicApi from '@/lib/publicApi';
import DynamicIcon from '@/components/DynamicIcon';

interface TechStackData {
  name: string;
  icon: string | null;
  color: string | null;
}

interface TechBadgeProps {
  name: string;
  className?: string;
}

// Singleton cache for tech stack data
let techStackCache: Map<string, TechStackData> | null = null;
let techStackPromise: Promise<void> | null = null;

async function fetchTechStacks(): Promise<Map<string, TechStackData>> {
  if (techStackCache) return techStackCache;

  if (!techStackPromise) {
    techStackPromise = publicApi
      .get('/tech-stacks')
      .then((res) => {
        const data = res.data.data ?? res.data;
        const map = new Map<string, TechStackData>();
        data.forEach((ts: any) => {
          map.set(ts.name, {
            name: ts.name,
            icon: ts.icon,
            color: ts.color,
          });
        });
        techStackCache = map;
      })
      .catch((err) => {
        console.error('[TechBadge] Failed to load tech stacks:', err.message);
        techStackCache = new Map(); // Empty map to prevent retries
      });
  }

  await techStackPromise;
  return techStackCache!;
}

export default function TechBadge({ name, className = '' }: TechBadgeProps) {
  const [techData, setTechData] = useState<TechStackData | null>(null);

  useEffect(() => {
    fetchTechStacks().then((map) => {
      setTechData(map.get(name) || { name, icon: null, color: null });
    });
  }, [name]);

  if (!techData) {
    // Loading state - render simple badge
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${className}`}
        style={{
          borderColor: '#888',
          color: '#888',
        }}
      >
        {name}
      </span>
    );
  }

  // Convert hex color to rgba with reduced opacity for more subtle appearance
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const baseColor = techData.color || '#888888';
  const borderColor = hexToRgba(baseColor, 0.3); // Very subtle border
  const textColor = hexToRgba(baseColor, 0.6); // Muted text color
  const bgColor = hexToRgba(baseColor, 0.05); // Very subtle background

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all hover:opacity-80 ${className}`}
      style={{
        borderColor,
        color: textColor,
        backgroundColor: bgColor,
      }}
    >
      {techData.icon && (
        <DynamicIcon name={techData.icon} size={14} className="flex-shrink-0" style={{ opacity: 0.7 }} />
      )}
      <span>{techData.name}</span>
    </span>
  );
}

// Preload function to be called on app mount
export function preloadTechStacks() {
  fetchTechStacks();
}
