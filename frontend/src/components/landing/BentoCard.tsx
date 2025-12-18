import type { ReactNode } from 'react';

interface BentoCardProps {
  icon: ReactNode;
  iconGradient?: string;
  title: string;
  description: string;
  variant?: 'light' | 'dark';
  children?: ReactNode;
  colSpan?: string;
}

export default function BentoCard({
  icon,
  iconGradient = 'from-primary-500 to-primary-700',
  title,
  description,
  variant = 'light',
  children,
  colSpan = ''
}: BentoCardProps) {
  const bgClass = variant === 'dark'
    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800'
    : 'bg-white';
  const textClass = variant === 'dark' ? 'text-white' : 'text-slate-900';
  const descClass = variant === 'dark' ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`${colSpan} group relative ${bgClass} rounded-3xl p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 overflow-hidden`}>
      <div className="relative">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold ${textClass} mb-3`}>{title}</h3>
        <p className={`text-sm leading-[1.6] ${descClass}`}>{description}</p>
        {children}
      </div>
    </div>
  );
}
