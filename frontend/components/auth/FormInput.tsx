"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";

interface FormInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, leftIcon, className, id, required, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            className={cn(
              leftIcon && "pl-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
