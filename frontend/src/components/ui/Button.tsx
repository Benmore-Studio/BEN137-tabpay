import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-150
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
    touch-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700 text-white
      hover:from-primary-700 hover:to-primary-800
      shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-white text-slate-900
      ring-1 ring-slate-200
      hover:bg-slate-50 hover:ring-slate-300
      shadow-sm hover:shadow-md
      hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent text-slate-600
      hover:bg-slate-100
    `,
    gold: `
      bg-gradient-to-r from-gold-400 to-gold-500
      text-slate-900 font-bold
      shadow-lg shadow-gold-500/25 hover:shadow-xl hover:shadow-gold-500/30
      hover:from-gold-500 hover:to-gold-600
      hover:-translate-y-0.5
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-5 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
