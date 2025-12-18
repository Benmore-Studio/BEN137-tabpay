import { PlusIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Price } from '../ui';
import { useFavorites } from '../../context';
import type { MenuItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  onQuickAdd: () => void;
  onViewDetails: () => void;
}

export default function MenuItemCard({ item, onQuickAdd, onViewDetails }: MenuItemCardProps) {
  const hasModifiers = item.modifiers && item.modifiers.length > 0;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <div
      className={`
        relative flex gap-4 p-5 bg-white rounded-2xl
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]
        border-t-[3px] border-primary-500
        ${item.available ? 'cursor-pointer hover:shadow-[0_8px_16px_-4px_rgba(124,58,237,0.15)] hover:-translate-y-0.5' : 'opacity-60'}
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        overflow-hidden
      `}
      onClick={item.available ? onViewDetails : undefined}
      tabIndex={item.available ? 0 : undefined}
      onKeyDown={(e) => {
        if (item.available && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onViewDetails();
        }
      }}
      role="button"
      aria-label={`View details for ${item.name}`}
    >
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-gold-400 to-primary-500" />

      {/* Image */}
      <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base text-slate-900 truncate">{item.name}</h3>
              {/* Favorite Heart */}
              <button
                onClick={handleFavoriteClick}
                className="flex-shrink-0 p-1 -m-1 rounded-full hover:bg-slate-100 transition-colors"
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorited ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500 animate-scale-in" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
                )}
              </button>
            </div>
            {!item.available && (
              <span className="text-xs text-red-600 font-medium">Unavailable</span>
            )}
          </div>
          <Price amount={item.price} className="flex-shrink-0 text-base font-bold" />
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-auto">{item.description}</p>

        {/* Dietary tags */}
        {item.dietary && (
          <div className="mt-3 flex gap-2">
            {item.dietary.vegetarian && (
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-md ring-1 ring-green-200">
                V
              </span>
            )}
            {item.dietary.vegan && (
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-md ring-1 ring-green-200">
                VG
              </span>
            )}
            {item.dietary.glutenFree && (
              <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-md ring-1 ring-amber-200">
                GF
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Add Button */}
      {item.available && !hasModifiers && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd();
          }}
          className="
            flex-shrink-0 self-center
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-gradient-to-br from-primary-500 to-primary-700 text-white
            shadow-lg shadow-primary-500/30
            hover:shadow-xl hover:shadow-primary-500/40 hover:scale-110
            active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          "
          aria-label={`Add ${item.name} to cart`}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
