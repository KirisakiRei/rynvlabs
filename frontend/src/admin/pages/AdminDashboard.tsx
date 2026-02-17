import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, FolderOpen, GraduationCap, Package, Tags, Cpu, Image } from 'lucide-react';
import adminApi from '../lib/adminApi';

interface DashboardStats {
  projects: number;
  academy: number;
  products: number;
  categories: number;
  techStacks: number;
  media: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    academy: 0,
    products: 0,
    categories: 0,
    techStacks: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, academy, products, categories, techStacks, media] = await Promise.all([
          adminApi.get('/admin/projects').catch(() => ({ data: { data: [] } })),
          adminApi.get('/admin/academy').catch(() => ({ data: { data: [] } })),
          adminApi.get('/admin/products').catch(() => ({ data: { data: [] } })),
          adminApi.get('/admin/categories').catch(() => ({ data: { data: [] } })),
          adminApi.get('/admin/tech-stacks').catch(() => ({ data: { data: [] } })),
          adminApi.get('/admin/media').catch(() => ({ data: { data: [] } })),
        ]);
        setStats({
          projects: projects.data?.data?.length ?? projects.data?.length ?? 0,
          academy: academy.data?.data?.length ?? academy.data?.length ?? 0,
          products: products.data?.data?.length ?? products.data?.length ?? 0,
          categories: categories.data?.data?.length ?? categories.data?.length ?? 0,
          techStacks: techStacks.data?.data?.length ?? techStacks.data?.length ?? 0,
          media: media.data?.data?.length ?? media.data?.length ?? 0,
        });
      } catch {
        // ignore errors
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Proyek', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-400' },
    { label: 'Tugas Akhir', value: stats.academy, icon: GraduationCap, href: '/admin/academy', color: 'text-green-400' },
    { label: 'Produk', value: stats.products, icon: Package, href: '/admin/products', color: 'text-purple-400' },
    { label: 'Kategori', value: stats.categories, icon: Tags, href: '/admin/categories', color: 'text-yellow-400' },
    { label: 'Tech Stack', value: stats.techStacks, icon: Cpu, href: '/admin/tech-stacks', color: 'text-cyan-400' },
    { label: 'Media', value: stats.media, icon: Image, href: '/admin/media', color: 'text-pink-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview konten website Rynvlabs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <Layers className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-heading font-bold text-foreground">
              {loading ? (
                <div className="h-9 w-12 bg-muted animate-pulse rounded" />
              ) : (
                card.value
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
