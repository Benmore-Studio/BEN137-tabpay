import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Martini, User, ShoppingCart, Receipt, Heart } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';
import { useCart, useProfile } from '../../context';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { path: '/menu', label: 'Menu', icon: Martini },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/orders', label: 'Orders', icon: Receipt },
  { path: '/cart', label: 'Cart', icon: ShoppingCart },
  { path: '/account', label: 'Account', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { isGuest } = useProfile();
  const [badgeAnimating, setBadgeAnimating] = useState(false);
  const prevItemCount = useRef(itemCount);

  // Guests don't need bottom nav - they access cart via header
  if (isGuest) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  // Animate cart badge when item count increases
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setBadgeAnimating(true);
      const timer = setTimeout(() => setBadgeAnimating(false), 300);
      return () => clearTimeout(timer);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-bottom">
      <LayoutGroup>
        <div className="flex items-center justify-around h-20 px-2 pb-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            const isCart = path === '/cart';

            return (
              <Link
                key={path}
                to={path}
                className={`
                  relative flex flex-col items-center justify-center flex-1 h-full
                  transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset
                  ${active ? 'text-primary-600' : 'text-slate-500'}
                `}
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-slate-500'}`}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  {isCart && itemCount > 0 && (
                    <motion.span
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-primary-600 rounded-full"
                      animate={badgeAnimating ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${active ? 'text-primary-600' : 'text-slate-500'}`}>
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
}
