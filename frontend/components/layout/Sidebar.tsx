'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import {
  Home,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: Role[];
  badge?: number;
}

const mainNavItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <Home size={20} />,
  },
  {
    href: '/vacations',
    label: 'Solicitações',
    icon: <FileText size={20} />,
    badge: 3,
  },
  {
    href: '/employees',
    label: 'Colaboradores',
    icon: <Users size={20} />,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    href: '/calendar',
    label: 'Calendário',
    icon: <Calendar size={20} />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    href: '/audit',
    label: 'Configurações',
    icon: <Settings size={20} />,
    roles: [Role.ADMIN],
  },
  {
    href: '/accessibility',
    label: 'Ajuda',
    icon: <HelpCircle size={20} />,
  },
];

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { hasRole, logout } = useAuth();

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => !item.roles || item.roles.some((role) => hasRole(role)));

  const filteredMainNav = filterByRole(mainNavItems);
  const filteredSecondaryNav = filterByRole(secondaryNavItems);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg
          text-sm font-medium transition-all relative
          ${isCollapsed ? 'justify-center' : ''}
          ${
            isActive
              ? 'bg-[var(--lbc-primary)] text-white'
              : 'text-[var(--lbc-text)] hover:bg-[var(--lbc-bg-secondary)]'
          }
        `}
        title={isCollapsed ? item.label : undefined}
      >
        {item.icon}
        {!isCollapsed && <span>{item.label}</span>}
        {item.badge && !isCollapsed && (
          <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-[var(--lbc-primary)] text-white'
          }`}>
            {item.badge}
          </span>
        )}
        {item.badge && isCollapsed && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-semibold rounded-full bg-[var(--lbc-primary)] text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full
          bg-white border-r border-[var(--lbc-border)]
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center h-16 px-4 border-b border-[var(--lbc-border)] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--lbc-primary)] flex items-center justify-center">
                <Calendar size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--lbc-text)]">VacationManager</span>
            </Link>
          )}
          
          {/* Collapse button - Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[var(--lbc-bg-secondary)] text-[var(--lbc-muted)]"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Close button - Mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)]"
          >
            <X size={20} className="text-[var(--lbc-muted)]" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100%-4rem)] p-3">
          {/* Main Nav */}
          <nav className="space-y-1">
            {filteredMainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Divider */}
          <div className="my-4 border-t border-[var(--lbc-border)]" />

          {/* Secondary Nav */}
          <nav className="space-y-1">
            {filteredSecondaryNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Logout */}
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium text-[var(--lbc-muted)] hover:bg-[var(--lbc-bg-secondary)] hover:text-[var(--status-rejected)]
              transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Sair' : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
