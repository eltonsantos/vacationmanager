'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Get initials from email
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[var(--lbc-border)] flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)]"
      >
        <Menu size={20} className="text-[var(--lbc-muted)]" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lbc-muted-light)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-[var(--lbc-bg)] text-[var(--lbc-text)] border border-[var(--lbc-border)] rounded-lg placeholder:text-[var(--lbc-muted-light)] focus:outline-none focus:border-[var(--lbc-primary)] focus:ring-2 focus:ring-[var(--lbc-primary)]/10 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--lbc-bg-secondary)] text-[var(--lbc-muted)]">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-[var(--status-rejected)] rounded-full">
            2
          </span>
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-[var(--lbc-bg-secondary)] flex items-center justify-center text-sm font-semibold text-[var(--lbc-muted)]">
          {user ? getInitials(user.email) : '??'}
        </div>
      </div>
    </header>
  );
}
