import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { ShoppingBag } from 'lucide-react';
import { AppLayout, Button, Price } from '../components';
import { FavoriteItemCard } from '../components/menu';
import { useFavorites, useCart } from '../context';
import { useToast } from '../components/ui/Toast';

export default function Favorites() {
  const { favorites, loading } = useFavorites();
  const { addItem, itemCount, subtotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (item: typeof favorites[0], quantity: number) => {
    if (!item.available) return;

    // Items with modifiers will use default options
    addItem(item, quantity, []);
    showToast(`${quantity}x ${item.name} added to cart`, 'success');
  };

  return (
    <AppLayout cartCount={0} showBackButton={false}>
      <div className="px-4 pt-6">
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

        {/* Favorites List */}
        {!loading && favorites.length > 0 && (
          <div className="space-y-2">
            {favorites.map((item) => (
              <FavoriteItemCard
                key={item.id}
                item={item}
                onAddToCart={(quantity: number) => handleAddToCart(item, quantity)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh]">
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

      {/* Sticky Checkout Bar - appears when cart has items */}
      {itemCount > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40">
          <div className="max-w-md mx-auto flex items-center gap-3">
            {/* Cart Summary */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
                <Price amount={subtotal} size="sm" className="text-slate-600" />
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={() => navigate('/checkout')}
              size="md"
              className="flex-shrink-0"
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
