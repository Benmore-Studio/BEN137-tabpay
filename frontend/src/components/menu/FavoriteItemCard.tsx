import { PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { Price } from '../ui';
import { useFavorites } from '../../context';
import type { MenuItem } from '../../types';

interface FavoriteItemCardProps {
  item: MenuItem;
  onAddToCart: (quantity: number) => void;
}

export default function FavoriteItemCard({ item, onAddToCart }: FavoriteItemCardProps) {
  const { toggleFavorite } = useFavorites();

  const handleAddToCart = () => {
    if (!item.available) return;
    onAddToCart(1); // Always add 1 for quick reordering
  };

  const handleRemoveFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <div
      className={`
        relative flex items-center gap-3 p-4 bg-white rounded-xl
        shadow-sm ring-1 ring-slate-900/5
        ${!item.available && 'opacity-60'}
        transition-all duration-200
      `}
    >
      {/* Image */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{item.name}</h3>
        <div className="flex items-center gap-2">
          <Price amount={item.price} size="sm" className="font-medium" />
          {item.dietary && (
            <div className="flex gap-1">
              {item.dietary.vegetarian && (
                <span className="px-1 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">V</span>
              )}
              {item.dietary.vegan && (
                <span className="px-1 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">VG</span>
              )}
              {item.dietary.glutenFree && (
                <span className="px-1 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded">GF</span>
              )}
            </div>
          )}
        </div>
        {!item.available && (
          <span className="text-xs text-red-600 font-medium">Unavailable</span>
        )}
      </div>

      {/* Heart Button - vertically centered */}
      <button
        onClick={handleRemoveFavorite}
        className="flex-shrink-0 w-10 h-10 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
        aria-label="Remove from favorites"
      >
        <HeartIcon className="w-5 h-5 text-red-500" />
      </button>

      {/* Quick Add Button */}
      <button
        onClick={handleAddToCart}
        disabled={!item.available}
        className={`
          flex-shrink-0 w-10 h-10 rounded-full
          flex items-center justify-center
          ${item.available
            ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }
          transition-all duration-200
        `}
        aria-label={`Add ${item.name} to cart`}
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
