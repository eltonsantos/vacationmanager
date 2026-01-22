"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  HelpCircle,
  X,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/types";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles?: Role[];
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Solicitações", href: "/vacations", icon: ClipboardList }, // TODO: Add dynamic badge count
  { title: "Colaboradores", href: "/employees", icon: Users, roles: [Role.MANAGER] }, // Only Manager sees this (to view their team)
  { title: "Usuários", href: "/users", icon: UserCog, roles: [Role.ADMIN] }, // Admin manages users here
  { title: "Calendário", href: "/calendar", icon: Calendar },
];

const secondaryNavItems: NavItem[] = [
  { title: "Configurações", href: "/audit", icon: Settings, roles: [Role.ADMIN] },
  { title: "Ajuda", href: "/accessibility", icon: HelpCircle },
];

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { hasRole, logout } = useAuth();

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => !item.roles || item.roles.some((role) => hasRole(role)));

  const filteredMainNav = filterByRole(mainNavItems);
  const filteredSecondaryNav = filterByRole(secondaryNavItems);

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href;
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          active
            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            : "text-muted-foreground",
          isCollapsed && "justify-center px-2"
        )}
        aria-current={active ? "page" : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                  active
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <TooltipProvider>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col border-r border-border bg-card transition-all duration-300",
          "lg:sticky lg:top-0 lg:z-auto lg:self-start",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-border px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <Calendar className="h-6 w-6 text-primary" />
              <span>VacationManager</span>
            </Link>
          )}
          
          {/* Collapse - Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("hidden lg:flex shrink-0", isCollapsed && "mx-auto")}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          {/* Close - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {filteredMainNav.map((item) => (
              <li key={item.href}>
                <NavItemComponent item={item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Secondary Navigation - Fixed at bottom */}
        <div className="mt-auto border-t border-border p-3">
          <nav>
            <ul className="space-y-1">
              {filteredSecondaryNav.map((item) => (
                <li key={item.href}>
                  <NavItemComponent item={item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="mt-3 pt-3 border-t border-border">
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sair</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
