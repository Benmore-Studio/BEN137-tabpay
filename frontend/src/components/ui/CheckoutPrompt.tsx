import { ShoppingBag } from 'lucide-react';
import Button from './Button';

interface CheckoutPromptProps {
  isOpen: boolean;
  itemName: string;
  onContinueShopping: () => void;
  onGoToCheckout: () => void;
}

export default function CheckoutPrompt({
  isOpen,
  itemName,
  onContinueShopping,
  onGoToCheckout,
}: CheckoutPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onContinueShopping}
      />

      {/* Prompt */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md mx-4 mb-0 sm:mb-4 p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Added to cart!</h3>
            <p className="text-sm text-slate-600">{itemName}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            onClick={onContinueShopping}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={onGoToCheckout}
            className="flex-1"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
