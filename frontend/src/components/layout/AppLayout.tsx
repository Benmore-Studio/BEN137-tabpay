import type { ReactNode } from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
  cartCount?: number;
  showHeader?: boolean;
  showBackButton?: boolean;
  headerTitle?: string;
  className?: string;
}

export default function AppLayout({
  children,
  cartCount = 0,
  showHeader = true,
  showBackButton = false,
  headerTitle,
  className = '',
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
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
    </div>
  );
}
