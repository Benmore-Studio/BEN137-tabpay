import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { AppLayout, Button, Price, QuantitySelector } from '../components';
import { useCart } from '../context';

export default function Cart() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <AppLayout showBackButton headerTitle="Cart">
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 text-center">
            Browse our menu and add some delicious items!
          </p>
          <Link to="/menu">
            <Button>Browse Menu</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBackButton headerTitle="Cart" cartCount={itemCount}>
      <div className="pb-40">
        {/* Cart Items */}
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="px-4 py-4">
              <div className="flex gap-3">
                {/* Item Image */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {item.menuItem.image ? (
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
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

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 -mr-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.menuItem.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modifiers */}
                  {item.selectedModifiers.length > 0 && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.selectedModifiers
                        .map((m) => m.selectedOptions.map((o) => o.name).join(', '))
                        .join(' \u2022 ')}
                    </p>
                  )}

                  {/* Special Instructions */}
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-500 italic mt-0.5">
                      "{item.specialInstructions}"
                    </p>
                  )}

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(qty) => updateQuantity(item.id, qty)}
                      min={0}
                      size="sm"
                    />
                    <Price amount={item.totalPrice} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Cart */}
        <div className="px-4 py-2">
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        {/* Price Breakdown */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <Price amount={subtotal} size="sm" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (8.75%)</span>
            <Price amount={tax} size="sm" />
          </div>
          <div className="flex justify-between font-semibold pt-1 border-t border-gray-100">
            <span>Total</span>
            <Price amount={total} size="lg" />
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={() => navigate('/checkout')}
          className="w-full"
          size="lg"
        >
          Proceed to Checkout
        </Button>
      </div>
    </AppLayout>
  );
}
