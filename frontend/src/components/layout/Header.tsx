import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Martini } from 'lucide-react';
import Badge from '../ui/Badge';

interface HeaderProps {
  cartCount?: number;
  showBackButton?: boolean;
  title?: string;
}

export default function Header({ cartCount = 0, showBackButton = false, title }: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left section - Logo */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Link
              to="/menu"
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Go back to menu"
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
            </Link>
          ) : null}
          {title ? (
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          ) : (
            <Link to="/menu" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                <Martini className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">TabPay</span>
            </Link>
          )}
        </div>

        {/* Center section - Desktop Navigation */}
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
        </nav>

        {/* Right section - Cart */}
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
    </header>
  );
}
