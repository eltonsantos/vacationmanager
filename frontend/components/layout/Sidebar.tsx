'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import {
  Home,
  Users,
  Calendar,
  Palmtree,
  ClipboardList,
  UserCog,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: Role[];
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Início',
    icon: <Home size={20} />,
  },
  {
    href: '/employees',
    label: 'Colaboradores',
    icon: <Users size={20} />,
    roles: [Role.ADMIN, Role.MANAGER],
  },
  {
    href: '/vacations',
    label: 'Férias',
    icon: <Palmtree size={20} />,
  },
  {
    href: '/calendar',
    label: 'Calendário',
    icon: <Calendar size={20} />,
  },
  {
    href: '/audit',
    label: 'Auditoria',
    icon: <ClipboardList size={20} />,
    roles: [Role.ADMIN],
  },
  {
    href: '/users',
    label: 'Utilizadores',
    icon: <UserCog size={20} />,
    roles: [Role.ADMIN],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.some((role) => hasRole(role))
  );

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
          fixed top-0 left-0 z-50 h-full w-64 
          bg-[var(--lbc-card)] border-r border-[var(--lbc-border)]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--lbc-border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--lbc-primary)] flex items-center justify-center">
              <Palmtree size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--lbc-text)]">
              VacationManager
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)]"
          >
            <X size={20} className="text-[var(--lbc-muted)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-[var(--lbc-primary)] text-white'
                      : 'text-[var(--lbc-text)] hover:bg-[var(--lbc-bg-secondary)]'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--lbc-border)]">
          <Link
            href="/accessibility"
            className="text-xs text-[var(--lbc-muted)] hover:text-[var(--lbc-primary)]"
          >
            Acessibilidade
          </Link>
        </div>
      </aside>
    </>
  );
}
