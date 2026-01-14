import { Link, useLocation } from 'react-router-dom';
import { Martini, User, Receipt, Heart, Home } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/menu', label: 'Menu', icon: Martini },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/orders', label: 'Orders', icon: Receipt },
  { path: '/account', label: 'Account', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-bottom">
      <LayoutGroup>
        <div className="flex items-center justify-around h-20 px-2 pb-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);

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
                <Icon
                  className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-slate-500'}`}
                  strokeWidth={active ? 2 : 1.5}
                />
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
