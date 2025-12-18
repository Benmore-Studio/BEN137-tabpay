import { CreditCard, Trash2, Check } from 'lucide-react';
import type { PaymentMethod } from '../../types/auth';
import { Card, Button } from '../ui';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
}

export default function PaymentMethodCard({ method, onSetDefault, onRemove }: PaymentMethodCardProps) {
  const getCardBrandColor = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'text-blue-600';
      case 'mastercard':
        return 'text-orange-600';
      case 'amex':
        return 'text-blue-700';
      case 'discover':
        return 'text-orange-500';
      default:
        return 'text-slate-600';
    }
  };

  const getPaymentIcon = () => {
    if (method.type === 'apple-pay') {
      return '🍎 Apple Pay';
    }
    if (method.type === 'google-pay') {
      return 'G Pay';
    }
    return <CreditCard className="w-5 h-5" />;
  };

  return (
    <Card variant="elevated" className="relative">
      {method.isDefault && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
          <Check className="w-3 h-3" />
          <span className="text-xs font-medium">Default</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
          {typeof getPaymentIcon() === 'string' ? (
            <span className="text-lg">{getPaymentIcon()}</span>
          ) : (
            getPaymentIcon()
          )}
        </div>

        <div className="flex-1 min-w-0">
          {method.type === 'card' ? (
            <>
              <p className={`font-semibold ${getCardBrandColor(method.brand)}`}>
                {method.brand?.toUpperCase() || 'Card'}
              </p>
              <p className="text-sm text-slate-500">•••• {method.last4}</p>
              {method.expiryMonth && method.expiryYear && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-900">
                {method.type === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
              </p>
              <p className="text-sm text-slate-500">Digital wallet</p>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {!method.isDefault && (
          <Button variant="secondary" onClick={onSetDefault} className="flex-1">
            Set as Default
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onRemove}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </Button>
      </div>
    </Card>
  );
}
