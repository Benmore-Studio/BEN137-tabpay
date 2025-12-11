import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({
  children,
  className = '',
  onClick,
  padding = 'md',
  variant = 'default',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const variants = {
    default: `
      bg-white ring-1 ring-slate-900/5
      shadow-sm
    `,
    elevated: `
      bg-white ring-1 ring-slate-900/5
      shadow-lg shadow-slate-900/5
    `,
    outlined: `
      bg-transparent ring-1 ring-slate-200
    `,
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        rounded-2xl
        transition-all duration-200
        ${variants[variant]}
        ${onClick ? `
          cursor-pointer
          hover:shadow-lg hover:ring-slate-200 hover:-translate-y-0.5
          active:scale-[0.99]
          text-left w-full
        ` : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
