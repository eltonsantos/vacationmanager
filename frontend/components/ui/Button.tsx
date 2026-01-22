import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--lbc-primary)] text-white hover:bg-[var(--lbc-primary-hover)] shadow-md hover:shadow-lg',
  secondary: 'bg-[var(--lbc-secondary)] text-white hover:bg-[var(--lbc-secondary-hover)] shadow-md hover:shadow-lg',
  accent: 'bg-[var(--lbc-accent)] text-white hover:bg-[var(--lbc-accent-hover)] shadow-md hover:shadow-lg',
  outline: 'border-2 border-[var(--lbc-border)] bg-transparent text-[var(--lbc-text)] hover:bg-[var(--lbc-bg-secondary)] hover:border-[var(--lbc-muted)]',
  ghost: 'bg-transparent text-[var(--lbc-text)] hover:bg-[var(--lbc-bg-secondary)]',
  danger: 'bg-[var(--status-rejected)] text-white hover:bg-red-600 shadow-md hover:shadow-lg',
  success: 'bg-[var(--status-approved)] text-white hover:bg-green-600 shadow-md hover:shadow-lg',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2.5
        font-semibold rounded-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.98]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
