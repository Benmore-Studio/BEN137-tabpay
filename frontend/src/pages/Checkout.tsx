import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { AppLayout, Button, Input, Price, Card } from '../components';
import { useCart } from '../context';

type PaymentMethod = 'card' | 'apple-pay' | 'google-pay';
type TipOption = 0 | 15 | 18 | 20 | 'custom';

// Service fee charged by TabPay (via Stripe Connect)
const SERVICE_FEE = 1.50;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, location, setLocation, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [tipOption, setTipOption] = useState<TipOption>(18);
  const [customTip, setCustomTip] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationInput, setLocationInput] = useState(location || '');
  const [locationError, setLocationError] = useState('');

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
    <AppLayout showBackButton headerTitle="Checkout">
      <div className="pb-40 px-4 pt-4 space-y-6">
        {/* Location Confirmation */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Delivery Location</h2>
          <Input
            label="Table or Machine Number"
            placeholder="e.g., Table 42 or Machine 123"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            error={locationError}
            helperText="Enter your table number or slot machine number"
          />
        </Card>

        {/* Order Summary */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}x {item.menuItem.name}
                </span>
                <Price amount={item.totalPrice} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Tip Selection */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Add a Tip</h2>
          <div className="grid grid-cols-5 gap-2">
            {tipOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTipOption(option.value)}
                className={`
                  py-2 px-1 rounded-lg text-sm font-medium
                  border transition-colors duration-200
                  ${
                    tipOption === option.value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
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
            <p className="mt-2 text-sm text-gray-500">
              Tip amount: ${tipAmount.toFixed(2)}
            </p>
          )}
        </Card>

        {/* Payment Method */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Payment Method</h2>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${
                  paymentMethod === 'card'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <CreditCardIcon className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-900">Credit / Debit Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod('apple-pay')}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${
                  paymentMethod === 'apple-pay'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <DevicePhoneMobileIcon className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-900">Apple Pay</span>
            </button>

            <button
              onClick={() => setPaymentMethod('google-pay')}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${
                  paymentMethod === 'google-pay'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <DevicePhoneMobileIcon className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-900">Google Pay</span>
            </button>
          </div>

          {/* Mock Card Input */}
          {paymentMethod === 'card' && (
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
              <p className="text-xs text-gray-500">
                * This is a demo. No payment will be processed.
              </p>
            </div>
          )}
        </Card>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By placing this order, you agree to our{' '}
          <button className="text-primary-600 underline">Terms of Service</button>
          {' '}and{' '}
          <button className="text-primary-600 underline">Privacy Policy</button>.
        </p>
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
          {tipAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tip</span>
              <Price amount={tipAmount} size="sm" />
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <Price amount={SERVICE_FEE} size="sm" />
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-gray-100">
            <span>Total</span>
            <Price amount={total} size="lg" />
          </div>
        </div>

        {/* Payment info */}
        <p className="text-xs text-gray-400 text-center">
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
