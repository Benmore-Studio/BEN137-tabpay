import type { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  cartCount?: number;
  showHeader?: boolean;
  showBackButton?: boolean;
  headerTitle?: string;
  showBottomNav?: boolean;
  className?: string;
}

export default function AppLayout({
  children,
  cartCount = 0,
  showHeader = true,
  showBackButton = false,
  headerTitle,
  showBottomNav = true,
  className = '',
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {showHeader && (
        <Header
          cartCount={cartCount}
          showBackButton={showBackButton}
          title={headerTitle}
        />
      )}
      <main
        className={`
          ${showHeader ? 'pt-14' : ''}
          ${className}
        `}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
