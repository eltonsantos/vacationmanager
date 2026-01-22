"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  trend,
}: StatCardProps) {
  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <article className="bg-card rounded-xl border border-border p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-warning"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            iconVariants[variant]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
