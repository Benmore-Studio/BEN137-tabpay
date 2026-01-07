import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout, Button, Price, QuantitySelector, EmptyState } from '../components';
import { useCart } from '../context';

const cartItemVariants = {
  initial: { opacity: 0, x: -20, height: 0 },
  animate: {
    opacity: 1,
    x: 0,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    x: 20,
    height: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

export default function Cart() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <AppLayout showBackButton headerTitle="Cart" showBottomNav={false}>
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse our menu and add some delicious items!"
            actionLabel="Browse Menu"
            actionTo="/menu"
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBackButton headerTitle="Cart" cartCount={itemCount} showBottomNav={false}>
      <div className="pb-48 pt-2">
        {/* Cart Items */}
        <div className="px-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={cartItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm p-4"
              >
              <div className="flex gap-3">
                {/* Item Image */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
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

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900">{item.menuItem.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 -mr-1 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.menuItem.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modifiers */}
                  {item.selectedModifiers.length > 0 && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {item.selectedModifiers
                        .map((m) => m.selectedOptions.map((o) => o.name).join(', '))
                        .join(' \u2022 ')}
                    </p>
                  )}

                  {/* Special Instructions */}
                  {item.specialInstructions && (
                    <p className="text-sm text-slate-500 italic mt-0.5">
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Clear Cart */}
        <div className="px-4 py-4">
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/50 p-4 space-y-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
        {/* Price Breakdown */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <Price amount={subtotal} size="sm" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax (8.75%)</span>
            <Price amount={tax} size="sm" />
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
            <span className="text-slate-900">Total</span>
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
