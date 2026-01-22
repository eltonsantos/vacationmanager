"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character types
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    return Math.min(score, 4);
  }, [password]);

  const getLabel = () => {
    switch (strength) {
      case 0:
        return "";
      case 1:
        return "Fraca";
      case 2:
        return "Razoável";
      case 3:
        return "Boa";
      case 4:
        return "Forte";
      default:
        return "";
    }
  };

  const getColor = () => {
    switch (strength) {
      case 1:
        return "bg-destructive";
      case 2:
        return "bg-warning";
      case 3:
        return "bg-info";
      case 4:
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  if (!password) return null;

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              strength >= level ? getColor() : "bg-muted"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Força da senha: <span className="font-medium">{getLabel()}</span>
      </p>
    </div>
  );
}
