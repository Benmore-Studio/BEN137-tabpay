import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { AppLayout, Button } from '../components';
import { MenuItemCard } from '../components/menu';
import { useFavorites, useCart } from '../context';
import { useToast } from '../components/ui/Toast';

export default function Favorites() {
  const { favorites, loading } = useFavorites();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (item: typeof favorites[0]) => {
    if (!item.available) return;

    addItem(item, 1, []);
    showToast(`${item.name} added to cart`, 'success');
  };

  // For modal support (reusing MenuItemCard component)
  const handleViewDetails = () => {
    // This would open the detail modal
    // For now, favorites just use quick add
  };

  return (
    <AppLayout cartCount={0} showBackButton={false}>
      <div className="px-4 pt-6 pb-24 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Favorites</h1>
          <p className="text-slate-500 mt-1">Your saved menu items</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && favorites.length > 0 && (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {favorites.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onQuickAdd={() => handleQuickAdd(item)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <HeartIcon className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No favorites yet</h3>
            <p className="text-slate-500 mt-1 mb-6">
              Save your favorite items for quick access
            </p>
            <Link to="/menu">
              <Button>Browse Menu</Button>
            </Link>
          </div>
        )}

        {/* Helper Text */}
        {!loading && favorites.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-slate-100 ring-1 ring-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Tap the <HeartIcon className="w-4 h-4 inline text-red-500 -mt-0.5" /> on any menu item to save it here
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
