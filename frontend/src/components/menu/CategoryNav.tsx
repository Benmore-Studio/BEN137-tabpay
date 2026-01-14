import { useRef, useEffect } from 'react';
import { CategoryChip } from '../ui';
import type { MenuCategory } from '../../types';
import { getCategoryItemCount } from '../../data/mockMenu';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  hasGuestBanner?: boolean;
}

export default function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  hasGuestBanner = false,
}: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll active category into view
  useEffect(() => {
    if (activeButtonRef.current && navRef.current) {
      const nav = navRef.current;
      const button = activeButtonRef.current;
      const navRect = nav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      if (buttonRect.left < navRect.left || buttonRect.right > navRect.right) {
        button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeCategory]);

  return (
    <div className={`sticky z-40 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/50 relative ${hasGuestBanner ? 'top-[92px]' : 'top-14'}`}>
      {/* Fade indicators for scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50/80 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none z-10" />

      <nav
        ref={navRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
        aria-label="Menu categories"
      >
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {categories.map((category) => (
            <div
              key={category.id}
              ref={category.id === activeCategory ? (el) => {
                if (el) {
                  activeButtonRef.current = el.querySelector('button');
                }
              } : undefined}
            >
              <CategoryChip
                label={category.name}
                active={category.id === activeCategory}
                count={getCategoryItemCount(category.id)}
                onClick={() => onCategoryChange(category.id)}
              />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
