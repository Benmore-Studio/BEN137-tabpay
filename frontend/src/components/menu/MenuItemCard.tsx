import { PlusIcon } from '@heroicons/react/24/outline';
import { Price } from '../ui';
import type { MenuItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  onQuickAdd: () => void;
  onViewDetails: () => void;
}

export default function MenuItemCard({ item, onQuickAdd, onViewDetails }: MenuItemCardProps) {
  const hasModifiers = item.modifiers && item.modifiers.length > 0;

  return (
    <div
      className={`
        flex gap-4 p-4 bg-white rounded-xl border border-gray-100
        ${item.available ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}
        transition-shadow duration-200
      `}
      onClick={item.available ? onViewDetails : undefined}
    >
      {/* Image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
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
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
            {!item.available && (
              <span className="text-xs text-red-600 font-medium">Unavailable</span>
            )}
          </div>
          <Price amount={item.price} className="flex-shrink-0" />
        </div>

        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>

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
            bg-primary-600 text-white
            hover:bg-primary-700 active:bg-primary-800
            transition-colors duration-200
          "
          aria-label={`Add ${item.name} to cart`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
