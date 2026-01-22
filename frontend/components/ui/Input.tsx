import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--lbc-text)] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[var(--lbc-muted)]">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-12 text-base
              ${leftIcon ? 'pl-12 pr-4' : 'px-4'}
              border-2 rounded-xl
              bg-[var(--lbc-card)] text-[var(--lbc-text)]
              placeholder-[var(--lbc-muted-light)]
              transition-all duration-200
              focus:outline-none focus:border-[var(--lbc-primary)] focus:ring-4 focus:ring-[var(--lbc-primary)]/10
              disabled:bg-[var(--lbc-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60
              ${error ? 'border-[var(--status-rejected)]' : 'border-[var(--lbc-border)]'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--status-rejected)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--lbc-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
