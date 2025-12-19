import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, DevicePhoneMobileIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { AppLayout, Button, Input, Price, Card, TimePicker } from '../components';
import { useCart, useOrderHistory, useProfile } from '../context';
import type { Order } from '../types';

type PaymentMethod = 'card' | 'apple-pay' | 'google-pay';
type TipOption = 0 | 15 | 18 | 20 | 'custom';

// Service fee charged by TabPay (via Stripe Connect)
const SERVICE_FEE = 1.50;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, location, setLocation, clearCart } = useCart();
  const { addOrder } = useOrderHistory();
  const { profile, isGuest } = useProfile();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [tipOption, setTipOption] = useState<TipOption>(18);
  const [customTip, setCustomTip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationInput, setLocationInput] = useState(location || '');
  const [locationError, setLocationError] = useState('');
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const [isASAP, setIsASAP] = useState(true);

  // Initialize default tip from user preferences
  useEffect(() => {
    if (!isGuest && profile) {
      const defaultTip = profile.preferences.defaultTipPercent;
      if ([0, 15, 18, 20].includes(defaultTip)) {
        setTipOption(defaultTip as TipOption);
      }
    }
  }, [isGuest, profile]);

  // Initialize default payment method
  useEffect(() => {
    if (!isGuest && profile && profile.paymentMethods.length > 0) {
      const defaultMethod = profile.paymentMethods.find((m) => m.isDefault) || profile.paymentMethods[0];
      setSelectedPaymentId(defaultMethod.id);
      setPaymentMethod(defaultMethod.type);
    }
  }, [isGuest, profile]);

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const tipPercent = tipOption === 'custom' ? 0 : tipOption;
  const tipAmount = tipOption === 'custom'
    ? parseFloat(customTip) || 0
    : subtotal * (tipPercent / 100);
  const tax = subtotal * 0.0875;
  const orderTotal = subtotal + tax + tipAmount; // Goes to casino
  const total = orderTotal + SERVICE_FEE; // Total charged to customer

  const validateLocation = () => {
    if (!locationInput.trim()) {
      setLocationError('Please enter your table or machine number');
      return false;
    }
    setLocationError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateLocation()) return;

    setIsProcessing(true);
    setLocation(locationInput.trim());

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate mock order ID
    const orderId = `TP${Date.now().toString(36).toUpperCase()}`;

    // Create order object
    const order: Order = {
      id: orderId,
      items: [...items],
      location: locationInput.trim(),
      subtotal,
      tax,
      tip: tipAmount > 0 ? tipAmount : undefined,
      total,
      status: 'received',
      createdAt: new Date(),
      scheduledFor: scheduledFor || undefined,
      isASAP,
    };

    // Save order to history
    addOrder(order);

    clearCart();
    navigate(`/confirmation/${orderId}`);
  };

  const tipOptions: { value: TipOption; label: string }[] = [
    { value: 0, label: 'No Tip' },
    { value: 15, label: '15%' },
    { value: 18, label: '18%' },
    { value: 20, label: '20%' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <AppLayout showBackButton headerTitle="Checkout" showBottomNav={false}>
      <div className="pb-64 px-4 pt-6 space-y-5">
        {/* Location Confirmation */}
        <Card variant="elevated">
          <h2 className="font-bold text-slate-900 mb-3">Delivery Location</h2>
          <Input
            label="Table or Machine Number"
            placeholder="e.g., Table 42 or Machine 123"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            error={locationError}
            helperText="Enter your table number or slot machine number"
          />
        </Card>

        {/* Order Scheduling */}
        <Card variant="elevated">
          <TimePicker
            value={scheduledFor}
            onChange={setScheduledFor}
            isASAP={isASAP}
            onASAPChange={setIsASAP}
          />
        </Card>

        {/* Order Summary */}
        <Card variant="elevated">
          <h2 className="font-bold text-slate-900 mb-3">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {item.quantity}x {item.menuItem.name}
                </span>
                <Price amount={item.totalPrice} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Tip Selection */}
        <Card variant="elevated">
          <h2 className="font-bold text-slate-900 mb-3">Add a Tip</h2>
          <div className="grid grid-cols-5 gap-2">
            {tipOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTipOption(option.value)}
                className={`
                  py-2.5 px-1 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${
                    tipOption === option.value
                      ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-slate-900 shadow-md shadow-gold-500/25'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
          {tipOption === 'custom' && (
            <div className="mt-3">
              <Input
                type="number"
                placeholder="Enter tip amount"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          )}
          {tipAmount > 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Tip amount: <span className="font-semibold text-gold-600">${tipAmount.toFixed(2)}</span>
            </p>
          )}
        </Card>

        {/* Payment Method */}
        <Card variant="elevated">
          <h2 className="font-bold text-slate-900 mb-3">Payment Method</h2>

          {/* Show saved payment methods for registered users */}
          {!isGuest && profile && profile.paymentMethods.length > 0 ? (
            <div className="space-y-2">
              {profile.paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPaymentId(method.id);
                    setPaymentMethod(method.type);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3.5 rounded-xl transition-[color,background-color,border-color,box-shadow] duration-150
                    ${
                      selectedPaymentId === method.id
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'ring-1 ring-slate-200 hover:ring-slate-300 bg-white'
                    }
                  `}
                >
                  {method.type === 'card' ? (
                    <CreditCardIcon className="w-6 h-6 text-slate-600" />
                  ) : (
                    <DevicePhoneMobileIcon className="w-6 h-6 text-slate-600" />
                  )}
                  <div className="flex-1 text-left">
                    {method.type === 'card' ? (
                      <>
                        <p className="font-medium text-slate-900">
                          {method.brand?.toUpperCase() || 'Card'} •••• {method.last4}
                        </p>
                        {method.expiryMonth && method.expiryYear && (
                          <p className="text-xs text-slate-500">
                            Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="font-medium text-slate-900">
                        {method.type === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
                      </p>
                    )}
                  </div>
                  {method.isDefault && (
                    <span className="flex items-center gap-1 text-xs font-medium text-primary-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      Default
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            // Guest checkout - show generic payment options
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`
                  w-full flex items-center gap-3 p-3.5 rounded-xl transition-[color,background-color,border-color,box-shadow] duration-150
                  ${
                    paymentMethod === 'card'
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'ring-1 ring-slate-200 hover:ring-slate-300 bg-white'
                  }
                `}
              >
                <CreditCardIcon className="w-6 h-6 text-slate-600" />
                <span className="font-medium text-slate-900">Credit / Debit Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('apple-pay')}
                className={`
                  w-full flex items-center gap-3 p-3.5 rounded-xl transition-[color,background-color,border-color,box-shadow] duration-150
                  ${
                    paymentMethod === 'apple-pay'
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'ring-1 ring-slate-200 hover:ring-slate-300 bg-white'
                  }
                `}
              >
                <DevicePhoneMobileIcon className="w-6 h-6 text-slate-600" />
                <span className="font-medium text-slate-900">Apple Pay</span>
              </button>

              <button
                onClick={() => setPaymentMethod('google-pay')}
                className={`
                  w-full flex items-center gap-3 p-3.5 rounded-xl transition-[color,background-color,border-color,box-shadow] duration-150
                  ${
                    paymentMethod === 'google-pay'
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'ring-1 ring-slate-200 hover:ring-slate-300 bg-white'
                  }
                `}
              >
                <DevicePhoneMobileIcon className="w-6 h-6 text-slate-600" />
                <span className="font-medium text-slate-900">Google Pay</span>
              </button>
            </div>
          )}

          {/* Mock Card Input for guests only */}
          {(isGuest || !profile || profile.paymentMethods.length === 0) && paymentMethod === 'card' && (
            <div className="mt-4 space-y-3">
              <Input
                label="Card Number"
                placeholder="4242 4242 4242 4242"
                disabled
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  disabled
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  disabled
                />
              </div>
              <p className="text-xs text-slate-500">
                * This is a demo. No payment will be processed.
              </p>
            </div>
          )}
        </Card>

        {/* Terms */}
        <p className="text-xs text-slate-500 text-center">
          By placing this order, you agree to our{' '}
          <button className="text-primary-600 hover:underline">Terms of Service</button>
          {' '}and{' '}
          <button className="text-primary-600 hover:underline">Privacy Policy</button>.
        </p>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 space-y-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40">
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
          {tipAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tip</span>
              <span className="font-medium text-gold-600">${tipAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Service Fee</span>
            <Price amount={SERVICE_FEE} size="sm" />
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-slate-200">
            <span className="text-slate-900">Total</span>
            <Price amount={total} size="lg" />
          </div>
        </div>

        {/* Payment info */}
        <p className="text-xs text-slate-400 text-center">
          Secure payment processed by Stripe
        </p>

        {/* Pay Button */}
        <Button
          onClick={handleSubmit}
          loading={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </Button>
      </div>
    </AppLayout>
  );
}
