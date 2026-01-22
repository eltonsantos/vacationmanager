'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Role } from '@/lib/types';
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.MANAGER]: 'Gestor',
  [Role.COLLABORATOR]: 'Colaborador',
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-[var(--lbc-card)] border-b border-[var(--lbc-border)] flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Menu button (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)]"
      >
        <Menu size={24} className="text-[var(--lbc-text)]" />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)] transition-colors"
          title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-[var(--lbc-muted)]" />
          ) : (
            <Sun size={20} className="text-[var(--lbc-muted)]" />
          )}
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[var(--lbc-text)]">
                {user.email}
              </p>
              <p className="text-xs text-[var(--lbc-muted)]">
                {roleLabels[user.role]}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[var(--lbc-primary)] flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)] transition-colors"
          title="Sair"
        >
          <LogOut size={20} className="text-[var(--lbc-muted)]" />
        </button>
      </div>
    </header>
  );
}
