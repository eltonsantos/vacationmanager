"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/types";

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = (role: Role) => {
    const labels: Record<Role, string> = {
      [Role.ADMIN]: "Administrador",
      [Role.MANAGER]: "Gestor",
      [Role.COLLABORATOR]: "Colaborador",
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role: Role) => {
    const colors: Record<Role, string> = {
      [Role.ADMIN]: "bg-[hsl(var(--destructive))] text-white",
      [Role.MANAGER]: "bg-[hsl(var(--primary))] text-white",
      [Role.COLLABORATOR]: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]",
    };
    return colors[role] || "bg-[hsl(var(--muted))]";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-sm font-semibold text-white">
          {getInitials(user.email)}
        </div>
        <ChevronDown className={`h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg py-2 z-50 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-lg font-semibold text-white">
                {getInitials(user.email)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                  {user.email}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <User className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              Meu Perfil
            </Link>
            <Link
              href="/audit"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <Settings className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              Configurações
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-[hsl(var(--border))] pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
