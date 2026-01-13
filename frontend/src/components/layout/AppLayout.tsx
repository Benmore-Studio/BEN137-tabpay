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
  showBarSelector?: boolean;
  className?: string;
}

export default function AppLayout({
  children,
  cartCount = 0,
  showHeader = true,
  showBackButton = false,
  headerTitle,
  showBottomNav = true,
  showBarSelector = false,
  className = '',
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {showHeader && (
        <Header
          cartCount={cartCount}
          showBackButton={showBackButton}
          title={headerTitle}
          showBarSelector={showBarSelector}
        />
      )}
      <main
        className={`
          ${showHeader ? 'pt-14' : ''}
          ${showBottomNav ? 'pb-24 md:pb-0' : ''}
          ${className}
        `}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
