"use client";

import { Briefcase, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/types";

interface RoleSelectorProps {
  value?: Role;
  onChange: (value: Role) => void;
  error?: string;
}

const roles = [
  {
    value: Role.MANAGER,
    title: "Gestor",
    description: "Aprova férias e gerencia equipes",
    icon: Briefcase,
  },
  {
    value: Role.COLLABORATOR,
    title: "Colaborador",
    description: "Solicita e acompanha suas férias",
    icon: Users,
  },
];

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <div
        className="grid grid-cols-2 gap-3"
        role="radiogroup"
        aria-label="Tipo de conta"
      >
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.value;

          return (
            <button
              key={role.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(role.value)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all",
                "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card",
                error && "border-destructive"
              )}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              )}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {role.title}
                </p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
