import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';
import { BarSelectorModal } from '../bar';
import { useProfile, useCart } from '../../context';
import FullLogo from '../../assets/Full_Logo.png';
import Logo from '../../assets/Logo.png';

interface HeaderProps {
  cartCount?: number;
  showBackButton?: boolean;
  title?: string;
  showBarSelector?: boolean;
}

export default function Header({ cartCount = 0, showBackButton = false, title, showBarSelector = false }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuest } = useProfile();
  const { serviceBar } = useCart();
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Auth users on mobile: Bar (left) - Logo (center) - Cart (right)
  // Guests/Desktop: Logo (left) - Nav (center) - Cart (right)
  const showAuthMobileLayout = !isGuest && showBarSelector && serviceBar;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main header bar */}
      <div className="bg-white border-b border-slate-200/50 shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Left section */}
          <div className="flex items-center gap-3 flex-1 md:flex-none">
            {showBackButton ? (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : showAuthMobileLayout ? (
              // Auth mobile: Show bar info on left
              <div className="flex items-center gap-1.5 text-slate-600 md:hidden">
                <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {serviceBar.name}
                </span>
              </div>
            ) : null}

            {/* Desktop: Always show full logo on left */}
            {title ? (
              <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            ) : (
              <Link to="/menu" className={`items-center gap-2 ${showAuthMobileLayout ? 'hidden md:flex' : 'flex'}`}>
                <img src={FullLogo} alt="TabPay Logo" className={isGuest ? 'h-14' : 'h-10'} />
              </Link>
            )}
          </div>

          {/* Center section - Desktop Navigation only */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/menu"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/menu')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Menu
            </Link>
            {!isGuest && (
              <>
                <Link
                  to="/orders"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/orders')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/account"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/account')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Account
                </Link>
              </>
            )}
          </nav>

          {/* Right section - Cart */}
          <div className="flex items-center justify-end flex-1 md:flex-none">
            <Link
              to="/cart"
              className="relative p-2 -mr-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCartIcon className="w-6 h-6 text-slate-700" />
              {cartCount > 0 && (
                <Badge
                  count={cartCount}
                  className="absolute -top-1 -right-1"
                />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Guest bar banner - slim contextual bar below header */}
      {showBarSelector && serviceBar && isGuest && (
        <div className="bg-slate-50 border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
            <MapPinIcon className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">
              Ordering from <span className="font-medium text-slate-900">{serviceBar.name}</span>
            </span>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsBarModalOpen(true)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Bar selector modal */}
      <BarSelectorModal
        isOpen={isBarModalOpen}
        onClose={() => setIsBarModalOpen(false)}
      />
    </header>
  );
}
