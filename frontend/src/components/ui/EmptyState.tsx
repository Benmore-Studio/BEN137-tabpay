import type { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionTo?: string;
  variant?: 'default' | 'error';
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  variant = 'default',
}: EmptyStateProps) {
  const iconBgColor = variant === 'error' ? 'bg-red-50' : 'bg-slate-100';
  const iconColor = variant === 'error' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center py-16">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-slate-500 mt-1 mb-6 max-w-sm mx-auto">{description}</p>
        {(actionLabel && (onAction || actionTo)) && (
          actionTo ? (
            <a href={actionTo}>
              <Button>{actionLabel}</Button>
            </a>
          ) : (
            <Button onClick={onAction}>{actionLabel}</Button>
          )
        )}
      </div>
    </div>
  );
}
