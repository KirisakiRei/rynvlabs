import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Package,
  Tags,
  Layers,
  PanelLeft,
  Settings,
  Image,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/projects', icon: FolderKanban, label: 'Proyek' },
  { to: '/admin/academy', icon: GraduationCap, label: 'Tugas Akhir' },
  { to: '/admin/products', icon: Package, label: 'Produk' },
  { to: '/admin/categories', icon: Tags, label: 'Kategori' },
  { to: '/admin/tech-stacks', icon: Layers, label: 'Tech Stack' },
  { to: '/admin/landing', icon: PanelLeft, label: 'Landing Page' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
  { to: '/admin/media', icon: Image, label: 'Media Library' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ isOpen, onClose, collapsed, onToggleCollapse }: AdminSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-200 lg:sticky lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          {!collapsed ? (
            <>
              <span className="text-lg font-heading font-bold text-primary">
                rynvlabs
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  CMS
                </span>
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="Kecilkan sidebar"
                >
                  <PanelLeftClose size={16} />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-md text-primary hover:bg-secondary transition-colors mx-auto"
              title="Perluas sidebar"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
                      collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )
                  }
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border shrink-0">
            <p className="text-xs text-muted-foreground text-center">
              rynvlabs CMS v1.0
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
