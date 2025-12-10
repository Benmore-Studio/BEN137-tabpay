import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';

interface HeaderProps {
  cartCount?: number;
  showBackButton?: boolean;
  title?: string;
}

export default function Header({ cartCount = 0, showBackButton = false, title }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Link
              to="/menu"
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back to menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          ) : (
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">TabPay</span>
            </Link>
          )}
        </div>

        {/* Right section - Cart */}
        <Link
          to="/cart"
          className="relative p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
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
