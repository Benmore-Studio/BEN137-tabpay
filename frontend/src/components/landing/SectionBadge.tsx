import type { ReactNode } from 'react';

interface SectionBadgeProps {
  icon: ReactNode;
  text: string;
  variant?: 'default' | 'purple';
}

export default function SectionBadge({ icon, text, variant = 'default' }: SectionBadgeProps) {
  const styles = variant === 'purple'
    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200/60'
    : 'bg-gradient-to-r from-white to-slate-50 border-slate-200/80';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${styles} border shadow-md shadow-slate-900/5 mb-6`}>
      {icon}
      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  );
}
