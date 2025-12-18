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
        flex gap-4 p-4 bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm
        ${item.available ? 'cursor-pointer hover:shadow-lg hover:ring-slate-200 hover:-translate-y-0.5' : 'opacity-60'}
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
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
      {/* Image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
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
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
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
          <Price amount={item.price} className="flex-shrink-0" />
        </div>

        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.description}</p>

        {/* Dietary tags */}
        {item.dietary && (
          <div className="mt-2 flex gap-1.5">
            {item.dietary.vegetarian && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                V
              </span>
            )}
            {item.dietary.vegan && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                VG
              </span>
            )}
            {item.dietary.glutenFree && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
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
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-gradient-to-br from-primary-500 to-primary-600 text-white
            shadow-md shadow-primary-500/25
            hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105
            active:scale-95
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          "
          aria-label={`Add ${item.name} to cart`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
