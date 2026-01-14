import type { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { useProfile } from '../../context';

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
  const { isGuest } = useProfile();

  // Guests don't see bottom nav - guest check centralized here
  const hasBottomNav = showBottomNav && !isGuest;

  // Guests with bar selector have extra banner height (header 56px + banner ~36px = 92px)
  const hasGuestBanner = showHeader && showBarSelector && isGuest;

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
          ${showHeader ? (hasGuestBanner ? 'pt-[92px]' : 'pt-14') : ''}
          ${hasBottomNav ? 'pb-24 md:pb-0' : ''}
          ${className}
        `}
      >
        {children}
      </main>
      {hasBottomNav && <BottomNav />}
    </div>
  );
}
