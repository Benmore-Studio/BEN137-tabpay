import type { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'gray';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children?: ReactNode;
  count?: number;
  className?: string;
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  gray: 'bg-slate-100 text-slate-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export default function Badge({
  children,
  count,
  className = '',
  max = 99,
  variant = 'primary',
  size = 'sm',
}: BadgeProps) {
  // If count is provided, use count-based badge (for cart, notifications)
  if (count !== undefined) {
    const displayCount = count > max ? `${max}+` : count.toString();
    return (
      <span
        className={`
          inline-flex items-center justify-center
          min-w-5 h-5 px-1.5
          text-xs font-bold text-white
          bg-primary-600 rounded-full
          ${className}
        `}
      >
        {displayCount}
      </span>
    );
  }

  // Otherwise use text-based badge (for status indicators)
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
